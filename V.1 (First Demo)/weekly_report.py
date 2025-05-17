import boto3
import os
import json
from datetime import datetime

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

# Environment Variables
INVENTORY_TABLE = os.environ['TABLE_NAME']
THRESHOLD = int(os.environ['THRESHOLD'])
S3_BUCKET = os.environ['S3_BUCKET']
ALERT_TOPIC_ARN = os.environ['ALERT_TOPIC_ARN']

table = dynamodb.Table(INVENTORY_TABLE)

def lambda_handler(event, context):
    low_stock_count = 0
    total_products = 0
    low_stock_items = []
    full_inventory = []

    # Scan the whole table
    response = table.scan()
    items = response.get('Items', [])

    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        items.extend(response.get('Items', []))

    total_products = len(items)

    for item in items:
        full_inventory.append({
            'product_id': item['product_id'],
            'product_name': item.get('product_name', 'Unknown'),
            'stock_count': int(item.get('stock_count', 0))
        })

        stock_level = int(item.get('stock_count', 0))
        if stock_level <= THRESHOLD:
            low_stock_count += 1
            low_stock_items.append({
                'product_id': item['product_id'],
                'product_name': item.get('product_name', 'Unknown'),
                'stock_level': stock_level
            })

    # Create summary
    summary = {
        'timestamp': datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        'total_products': total_products,
        'low_stock_count': low_stock_count,
        'low_stock_items': low_stock_items,
        'full_inventory': full_inventory
    }

    # Save to S3
    filename = f"weekly_summary_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"
    s3.put_object(
        Bucket=S3_BUCKET,
        Key=filename,
        Body=json.dumps(summary, indent=4),
        ContentType='application/json'
    )

    print(f"Summary saved to S3: {filename}")

    sns_message = f"Weekly report has been generated!\n\nLink: s3://{S3_BUCKET}/{filename}"
    
    # using environment variables better for security and flexibility
    sns.publish(
        TopicArn=ALERT_TOPIC_ARN, 
        Subject="Inventory Weekly Report",
        Message=sns_message
    )

    return {
        'statusCode': 200,
        'body': json.dumps('Weekly Summary Generated & Saved to S3')
    }
