# Inventory Monitoring System

## 🚧 Project Status: **In Development**

### Current state:
#### **A simple demo is ready and set for alerting users on changes made on the table, as well as the summary weekly report**
---

### **Overview**
This project provides an **automated inventory monitoring system** using only free tier AWS services.  
It tracks stock levels in **real-time** and generates **weekly summary reports**.

---

## **📌 Features**

✅ **Real-time stock tracking** (DynamoDB Streams + Lambda)  
✅ **Low stock alerts** (SNS Notifications)  
✅ **Weekly reports saved to S3**  
✅ **Automated report generation via EventBridge**  

---

## **⚙️ AWS Services Used**

- **DynamoDB** → Inventory storage
- **Lambda** → Processes stock updates, generates reports, and parses CSV files
- **SNS** → Sends alerts & notifications
- **S3** → Stores weekly reports & receives uploaded CSV files
- **EventBridge** → Schedules weekly report generation

---

## **🚀 How It Works**

### **🔹 Real-Time Inventory Updates**

1. **DynamoDB Streams trigger Lambda** when stock updates.
2. Lambda **checks for important changes**, such as a product name or price change and **sends SNS alerts if needed.**
3. 

### **🔹 Weekly Summary Reports**

1. **EventBridge triggers Lambda** every Thursday at 5 PM UTC.
2. The report is saved in **S3** and an **SNS notification** is sent.



### **🔹 Infrastructure Diagram:**
![image](https://github.com/user-attachments/assets/f6ba078c-8085-4411-8a00-72a02fbfc197)




### **🔹 Sequence Diagram:**
![v1-seq-diagram](https://github.com/user-attachments/assets/d9ded8aa-50e6-47e3-9205-99c8ddd5d864)
 
![V2-seq-Diagram](https://github.com/user-attachments/assets/45d4afb3-33a0-4704-80d3-949bbf0939ca)

---

## Data Design

This project utilizes DynamoDB, a NoSQL database service, for data storage. The data design is optimized for scalability and performance, reflecting DynamoDB's key-value and document-based structure.

### Entities and Relationships

- **Product:**
  - product_id (Primary Key)
  - product_name
  - product_category
  - stock_count
  - last_alert_time
- **Sales:**
  - sale_id (Primary Key)
  - product_id (used to associate with product)
  - sale_date
  - quantity
  - price
- **Alerts:**
  - alert_id (Primary Key)
  - product_id (used to associate with product)
  - alert_time
  - alert_type
- **Reports:**

  - report_id (Primary Key)
  - report_date
  - report_type
  - report_location (e.g., S3 URI)

  - Relationships are managed using product_id to associate sales and alerts with products.
  - Sales data is linked to products via the `product_id` attribute.
  - Alerts are also linked to products using `product_id`.
  - Reports are stored in S3, with the location referenced in the `report_location` attribute.

### DynamoDB Details

- The `product_id` serves as the primary key for the Product entity.
- Sales data uses `sale_id` as the primary key and includes `product_id` for association with product information.

For detailed information on each attribute, please refer to the [Data Dictionary](link-to-your-data-dictionary).

---

## **📜 Data Dictionary**

| Attribute          | Type             | Description                                            | Dynamo DB Details           |
| ------------------ | ---------------- | ------------------------------------------------------ | --------------------------- |
| `product_id`       | String           | Unique identifier for the product.                     | Partition Key               |
| `product_name`     | String           | Name of the product.                                   |
| `product_category` | String           | Category of the product (e.g., electronics, clothing). |
| `stock_count`      | Number (Integer) | Current stock level of the product.                    |
| `product_price`    | Number           | Price of the product per unit.                         |
| `last_alert_time`  | String           | Timestamp of the last alert sent.                      |
| `sale_id`          | String           | Unique identifier for the sale transaction.            | Partition key (Sales Table) |
| `sale_date`        | String (date)    | date of the sale.                                      |
| `quantity`         | Number           | quantity of the product sold in the transaction.       |
| `current_price`    | Number           | Price of the product at the time of sale.              |

---

## **📈 Monitoring & Metrics**

The system uses Amazon CloudWatch to monitor application health and performance:

Lambda Monitoring: CloudWatch tracks Lambda execution metrics such as success/error count and duration.

SQS Metrics:

NumberOfMessagesSent

NumberOfMessagesReceived

ApproximateAgeOfOldestMessage

CloudWatch Alarms: An alarm is configured for the SQS queue to alert if messages are delayed or stuck for too long.

---

## **🔒 Security Considerations**
This project follows basic AWS security best practices:

IAM Roles and Least Privilege: Lambda functions use a dedicated IAM role with only the permissions required to read from S3, write to DynamoDB, and send messages to SNS.

Read-Only IAM Access: A separate IAM user was created for grading purposes with read-only permissions across used services (S3, DynamoDB, Lambda, CloudWatch).

S3 Bucket Protection: The S3 bucket uses server-side encryption (SSE-S3) to protect uploaded CSV files. Public access is disabled.

No Hardcoded Secrets: All credentials and secrets are managed through IAM roles and environment variables (no secrets in code).

---
## **📝 Contributing**

If you’d like to contribute, feel free to open a Pull Request!

---
