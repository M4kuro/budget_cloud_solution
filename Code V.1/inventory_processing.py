import json
import boto3
import os
from datetime import datetime, timedelta

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')
sns = boto3.client('sns')

# Environment variables
INVENTORY_TABLE = os.environ['TABLE_NAME']
ALERT_TOPIC_ARN = os.environ['ALERT_TOPIC_ARN']
THRESHOLD = int(os.environ['THRESHOLD'])

table = dynamodb.Table(INVENTORY_TABLE)

# Cooldown period in hours
COOLDOWN_HOURS = 24

def lambda_handler(event, context):
    low_stock_items = []
    significant_changes = []

    for record in event['Records']:
        if record['eventName'] in ['INSERT', 'MODIFY']:
            new_image = record['dynamodb']['NewImage']
            product_id = new_image['product_id']['S']
            product_name = new_image.get('product_name', {'S': 'Unknown Product'})['S']
            product_category = new_image.get('product_category', {'S': 'Uncategorized'})['S']
            stock_level = int(new_image['stock_count']['N'])

            # Get old image (if exists)
            old_image = record['dynamodb'].get('OldImage')

            old_stock_level = None
            old_name = None
            old_category = None

            if old_image:
                old_stock_level = int(old_image['stock_count']['N']) if 'stock_count' in old_image else None
                old_name = old_image.get('product_name', {'S': product_name})['S']
                old_category = old_image.get('product_category', {'S': product_category})['S']

            print(f"Detected change for {product_name} (ID: {product_id}) - New stock: {stock_level}")

            # Check last alert time 
            last_alert_time = None
            if 'last_alert_time' in new_image:
                last_alert_time = new_image['last_alert_time']['S']

            cooldown_passed = True
            if last_alert_time:
                last_alert_dt = datetime.strptime(last_alert_time, "%Y-%m-%dT%H:%M:%SZ")
                if datetime.utcnow() - last_alert_dt < timedelta(hours=COOLDOWN_HOURS):
                    cooldown_passed = False

            # New product
            if record['eventName'] == 'INSERT':
                significant_changes.append(f" New product added: {product_name} (ID: {product_id}), Category: {product_category}, Stock: {stock_level}")
            
            # Name or Category change
            if old_image:
                if product_name != old_name or product_category != old_category:
                    significant_changes.append(f" Product {product_id} updated:\n - Name: {old_name} → {product_name}\n - Category: {old_category} → {product_category}")

            # Stock drops below threshold
            if stock_level <= THRESHOLD and cooldown_passed:
                low_stock_items.append({
                    'product_id': product_id,
                    'product_name': product_name,
                    'product_category': product_category,
                    'current_stock': stock_level,
                    'threshold': THRESHOLD
                })
                # Update last alert time in DynamoDB
                table.update_item(
                    Key={'product_id': product_id},
                    UpdateExpression='SET last_alert_time = :time',
                    ExpressionAttributeValues={
                        ':time': datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
                    }
                )

    # Send alerts if needed
    if low_stock_items or significant_changes:
        send_alert(low_stock_items, significant_changes)

    return {
        'statusCode': 200,
        'body': json.dumps(f"Processed {len(event['Records'])} record(s).")
    }

def send_alert(low_stock_items, significant_changes):
    message = "INVENTORY ALERT\n\n"

    # Include name/category changes
    if significant_changes:
        message += " Change(s):\n"
        for change in significant_changes:
            message += f"{change}\n"
        message += "\n"

    # Include low stock items
    if low_stock_items:
        message += "🔻 Low Stock Items:\n"
        for item in low_stock_items:
            message += f"• {item['product_name']} (ID: {item['product_id']})\n"
            message += f"  Category: {item['product_category']}\n"
            message += f"  Current Stock: {item['current_stock']} (Threshold: {item['threshold']})\n\n"

    sns.publish(
        TopicArn=ALERT_TOPIC_ARN,
        Subject="Inventory Alert: Stock or Product Updates",
        Message=message
    )

    print("Alert sent.")
