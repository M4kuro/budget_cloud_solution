import boto3
import os
import json
import tempfile
import csv
from datetime import datetime

s3 = boto3.client('s3')
sns = boto3.client('sns')

THRESHOLD = int(os.environ['THRESHOLD'])  # e.g. 10
DEST_BUCKET = os.environ['DEST_BUCKET']  # Where the JSON will be stored
ALERT_TOPIC_ARN = os.getenv("ALERT_TOPIC_ARN")

def lambda_handler(event, context):
    print("Lambda started...")

    bucket_name = event['Records'][0]['s3']['bucket']['name']
    object_key = event['Records'][0]['s3']['object']['key']
    print(f"Reading file from: {bucket_name}/{object_key}")

    with tempfile.NamedTemporaryFile() as tmp_file:
        s3.download_file(bucket_name, object_key, tmp_file.name)
        print("File downloaded, reading CSV...")

        low_stock_items = []
        full_inventory = []

        with open(tmp_file.name, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                print(f"Processing row: {row}")
                try:
                    stock_count = int(row['stock_count'])
                    product_price = float(row['product_price'])

                    product_data = {
                        'product_id': row['product_id'],
                        'product_name': row['product_name'],
                        'product_price': product_price,
                        'stock_count': stock_count
                    }
                    full_inventory.append(product_data)

                    if stock_count <= THRESHOLD:
                        low_stock_items.append({
                            'product_id': row['product_id'],
                            'product_name': row['product_name'],
                            'stock_level': stock_count
                        })

                except Exception as e:
                    print(f"Error processing row: {e}")
                    continue

        summary = {
            'timestamp': datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            'total_products': len(full_inventory),
            'low_stock_count': len(low_stock_items),
            'low_stock_items': low_stock_items,
            'full_inventory': full_inventory
        }

        summary_key = f"upload_summary_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"
        s3.put_object(
            Bucket=DEST_BUCKET,
            Key=summary_key,
            Body=json.dumps(summary, indent=4),
            ContentType='application/json'
        )

        if ALERT_TOPIC_ARN:
            message = f"Inventory report generated from CSV upload!\n\nLink: s3://{DEST_BUCKET}/{summary_key}"
            sns.publish(
                TopicArn=ALERT_TOPIC_ARN,
                Subject="Inventory Upload Summary",
                Message=message
            )

    print("Lambda finished successfully.")
    return {
        'statusCode': 200,
        'body': json.dumps('Summary generated and uploaded')
    }
