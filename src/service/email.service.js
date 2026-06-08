const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  sendInvoiceEmail = async (rentalData) => {
    const {
      rentalId = 'N/A',
      email,
      cameraName = 'Thiết bị',
      rentStart,
      rentEnd,
      renter = {},
      phone = 'N/A',
      totalPrice = 0,
      payment = {},
      paymentMode
    } = rentalData;

    const displayPaymentMethod = payment.method || paymentMode || 'N/A';

    const displayRenterName = renter.name || 'Quý khách';

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">Crab RENTAL</h1>
                <p style="margin: 5px 0 0;">Hóa đơn thuê thiết bị</p>
            </div>
            <div style="padding: 20px;">
                <p>Xin chào <strong>${displayRenterName}</strong>,</p>
                <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Dưới đây là thông tin chi tiết về đơn hàng của bạn:</p>

                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Mã đơn hàng:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${rentalId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Thiết bị:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${cameraName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Thời gian thuê:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${rentStart ? new Date(rentStart).toLocaleDateString() : 'N/A'} - ${rentEnd ? new Date(rentEnd).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Số điện thoại:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${phone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phương thức:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${displayPaymentMethod}</td>
                    </tr>

                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; font-size: 1.2em;">Tổng cộng:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; font-size: 1.2em; color: #d32f2f;">${totalPrice.toLocaleString()} VNĐ</td>
                    </tr>
                </table>

                <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua số điện thoại hoặc email này.</p>
            </div>
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 0.8em; color: #777;">
                <p>&copy; 2024 IAM DIGITAL RENTAL. All rights reserved.</p>
            </div>
        </div>
    `;

    const mailOptions = {
      from: `"CRAB rental" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `Hóa đơn thuê thiết bị - ${rentalId}`,
      // subject: `Hóa đơn mua hàng - ${rentalId}`,
      html: htmlContent,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
