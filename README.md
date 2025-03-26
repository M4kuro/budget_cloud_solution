# Inventory Monitoring System 

### 🚧 Project Status: **In Development**

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
- **Lambda** → Processes stock updates & generates reports
- **SNS** → Sends alerts & notifications
- **S3** → Stores weekly reports
- **EventBridge** → Schedules weekly report generation

---

## **🚀 How It Works**
### **🔹 Real-Time Inventory Updates**
1. **DynamoDB Streams trigger Lambda** when stock updates.
2. Lambda **checks stock levels** and **sends SNS alerts** if needed.

### **🔹 Weekly Summary Reports**
1. **EventBridge triggers Lambda** every Thursday at 5 PM UTC.
2. The report is saved in **S3** and an **SNS notification** is sent.




### **🔹 Infrastructure Diagram:**
![image](https://github.com/user-attachments/assets/f6ba078c-8085-4411-8a00-72a02fbfc197)




### **🔹 Sequence Diagram:**

![image](https://github.com/user-attachments/assets/0faf4d8c-bc71-4792-98e5-cc7c7e297064)

   

---

## **📜 Data Design**
| Attribute         | Type   | Description |
|-------------------|--------|-------------|
| `product_id`      | String | Unique identifier for the product. |
| `product_name`    | String | Name of the product. |
| `product_category`| String | Category of the product (e.g., electronics, clothing). |
| `stock_count`     | Number | Current stock level of the product. |
| `last_alert_time` | String | Timestamp of the last alert sent. |


---

## **📝 Contributing**
If you’d like to contribute, feel free to open a Pull Request!  

---




