# Inventory Monitoring System 

## 🚧 Project Status: **In Development**
### Current state:
**V.1 - Fully functional monitoring system using real-time triggers and weekly reports.**

**V.2 - Partially implemented:**
   + UI Dashboard added (mock data enabled for demo).
   + Upload inventory via CSV to S3 – triggers Lambda to generate reports.
   + XLSX upload considered but postponed due to complexity.
   + Final implementation will focus on making the system plug-and-play for small teams.
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
✅ **CSV Upload support to generate inventory reports**  
✅ **Frontend dashboard mock UI built with React**  


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
2. Lambda **checks for important changes**, such as a product name or price and **sends SNS alerts if needed.**

### **🔹 Weekly Summary Reports**
1. **EventBridge triggers Lambda** every Thursday at 5 PM UTC.
2. The report is saved in **S3** and an **SNS notification** is sent.

### 🔹 CSV Upload Flow
1. User uploads a `.csv` file to the designated **input S3 bucket**.
2. A Lambda function is triggered, which:
   - Parses the file
   - Extracts inventory data
   - Saves a JSON summary to another S3 bucket
   - Sends an optional SNS alert with a summary link




### **🔹 Infrastructure Diagram:**
![image](https://github.com/user-attachments/assets/f6ba078c-8085-4411-8a00-72a02fbfc197)




### **🔹 Sequence Diagram:**

![image](https://github.com/user-attachments/assets/0faf4d8c-bc71-4792-98e5-cc7c7e297064)

---
## Data Design

This project utilizes DynamoDB, a NoSQL database service, for data storage. The data design is optimized for scalability and performance, reflecting DynamoDB's key-value and document-based structure.

### Entities and Relationships

* **Product:**
    * product\_id (Primary Key)
    * product\_name
    * product\_category
    * stock\_count
    * last\_alert\_time
* **Sales:**
    * sale\_id (Primary Key)
    * product\_id (used to associate with product)
    * sale\_date
    * quantity
    * price
* **Alerts:**
    * alert\_id (Primary Key)
    * product\_id (used to associate with product)
    * alert\_time
    * alert\_type
* **Reports:**
    * report\_id (Primary Key)
    * report\_date
    * report\_type
    * report\_location (e.g., S3 URI)

    * Relationships are managed using product\_id to associate sales and alerts with products.
    * Sales data is linked to products via the `product_id` attribute.
    * Alerts are also linked to products using `product_id`.
    * Reports are stored in S3, with the location referenced in the `report_location` attribute.

### DynamoDB Details

* The `product_id` serves as the primary key for the Product entity.
* Sales data uses `sale_id` as the primary key and includes `product_id` for association with product information.

For detailed information on each attribute, please refer to the [Data Dictionary](link-to-your-data-dictionary).

   

---

## **📜 Data Dictionary**
| Attribute         | Type   | Description | Dynamo DB Details |
|-------------------|--------|-------------|-------------------|
| `product_id`      | String | Unique identifier for the product. | Partition Key |
| `product_name`    | String | Name of the product. |
| `product_category`| String | Category of the product (e.g., electronics, clothing). |
| `stock_count`     | Number (Integer) | Current stock level of the product. |
| `product_price`   | Number | Price of the product per unit. |
| `last_alert_time` | String | Timestamp of the last alert sent. |
| `sale_id`         | String |  Unique identifier for the sale transaction. | Partition key (Sales Table)|
| `sale_date`       | String (date) | date of the sale. |
| `quantity`        | Number | quantity of the product sold in the transaction. |
| `current_price`   | Number| Price of the product at the time of sale. |



---

## **📝 Contributing**
If you’d like to contribute, feel free to open a Pull Request!  

---




