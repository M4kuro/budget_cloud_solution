# Inventory Monitoring System 

### 🚧 Project Status: **In Development**

### **Overview**
This project provides an **automated inventory monitoring system** using AWS services.  
It tracks stock levels in **real-time** and generates **weekly summary reports**.

---

## **📌 Features**
✅ **Real-time stock tracking** (DynamoDB Streams + Lambda)  
✅ **Low stock alerts** (SNS Notifications)  
✅ **Weekly reports saved to S3**  
✅ **Automated report generation via EventBridge**  

---

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

---

## **📜 API & Data Design**
- **DynamoDB Table Structure**
- **Example stock update JSON request**
- **Querying inventory using boto3**

---

## **📝 Contributing**
If you’d like to contribute, feel free to open a Pull Request!  

---




