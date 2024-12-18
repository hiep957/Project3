export const getOrderStatusEmailHtml = (order: any, paymentStatus: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f4f4f4;
            border-radius: 8px;
            padding: 20px;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 10px;
            border-radius: 8px 8px 0 0;
        }
        .order-details {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        .status {
            text-transform: uppercase;
            font-weight: bold;
            color: ${getStatusColor(paymentStatus)};
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .items-table th, .items-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Status Update</h1>
        </div>
        
        <div class="order-details">
            <h2>Order Details</h2>
            <p><strong>Order Code:</strong> ${order.orderCode}</p>
            <p><strong>Status:</strong> <span class="status">${paymentStatus}</span></p>
            
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Size</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items
                      .map(
                        (item: any) => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.size}</td>
                            <td>${item.quantity}</td>
                            <td>$${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3"><strong>Total</strong></td>
                        <td><strong>$${order.totalAmount.toFixed(
                          2
                        )}</strong></td>
                    </tr>
                </tfoot>
            </table>
            
            <p>If you have any questions about your order, please contact our customer support.</p>
        </div>
        
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Our Store. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

// Helper function to get status color
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "#4CAF50"; // Green
    case "pending":
      return "#FFC107"; // Amber
    case "canceled":
      return "#F44336"; // Red
    case "expired":
      return "#9E9E9E"; // Gray
    default:
      return "#000000"; // Black
  }
};
