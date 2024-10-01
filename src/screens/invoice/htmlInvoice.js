const htmlInvoice = `
    <!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hóa Đơn Thu Tiền Trọ</title>
   
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
            max-width: 600px;
            background-color: #f9f9f9;
            align-self: center;
        }
        h1 {
            text-align: center;
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .invoice-details {
            margin-bottom: 20px;
        }
        .invoice-details p {
            margin: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table, th, td {
            border: 1px solid #ccc;
        }
        th, td {
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total {
            font-weight: bold;
            text-align: right;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>Hóa Đơn Thu Tiền Trọ</h1>
    <div class="invoice-header">
        <div>
            <h3>DTHome</h3>
            <p>Địa chỉ: c2/9a, Võ Văn Vân, Bình Chánh, Thành phố HCM</p>
        </div>
        <div>
            <p>Mã Hóa Đơn: #HD{{invoiceId}}</p>
            <p>Ngày: {{invoiceCreateAt}}</p>
        </div>
    </div>

    <div class="invoice-details">
        <p><strong>Khách hàng:</strong> {{customerName}}</p>
        <p><strong>Phòng:</strong> {{roomName}}</p>
        <p><strong>Nội dung:</strong> {{description}}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Mô Tả</th>
                <th>Số Tiền</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Tiền Thuê Phòng</td>
                <td>{{roomPrice}} VNĐ</td>
            </tr>
            <tr>
                <td>Tiền Điện (cũ: {{powerStart}} kWh, mới: {{powerEnd}} kWh)</td>
                <td>{{powerPrice}} VNĐ</td>
            </tr>
            <tr>
                <td>Tiền Nước (cũ: {{waterStart}} m³, mới: {{waterEnd}} m³)</td>
                <td>{{waterPrice}} VNĐ</td>
            </tr>
             <tr>
                <td>Tiền Rác</td>
                <td>{{trashPrice}} VNĐ</td>
            </tr>
            <tr>
                <td class="total">Tổng Cộng</td>
                <td class="total">{{amount}} VNĐ</td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        <strong>Cảm ơn bạn đã chọn DTHome</stro>
    </div>

</body>
</html>
`

export default htmlInvoice