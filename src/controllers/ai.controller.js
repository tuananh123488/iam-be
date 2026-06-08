const axios = require('axios');
const Product = require('../models/product.model');

class AiController {
    chat = async (req, res) => {
        try {
            const { message, history = [] } = req.body;
            if (!message) {
                return res.status(400).json({ message: 'Message is required' });
            }

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey || apiKey === 'your_gemini_api_key_here') {
                return res.status(200).json({
                    reply: "Xin chào! Mình là Trợ lý AI của Crab RENTAL. Hiện tại API Key cho AI chưa được cấu hình trong file `.env`. Vui lòng liên hệ Admin để thêm `GEMINI_API_KEY` vào file cấu hình nhé!"
                });
            }

            // 1. Fetch camera inventory
            const products = await Product.find({});
            const inventoryText = products.map(p => {
                const p1 = (p.price?.priceOne || 0) * 1000;
                const p2 = (p.price?.priceTwo || 0) * 1000;
                const p3 = (p.price?.priceThree || 0) * 1000;
                return `- **${p.name}** (${p.brand}): Giá thuê: ${p1.toLocaleString('vi-VN')}đ/ngày (thuê 1 ngày), ${p2.toLocaleString('vi-VN')}đ/ngày (thuê 2-3 ngày), ${p3.toLocaleString('vi-VN')}đ/ngày (thuê >3 ngày). Mô tả: ${p.description}`;
            }).join('\n');

            // 2. System Instructions for Gemini
            const systemPrompt = `Bạn là trợ lý ảo tư vấn thiết bị và máy ảnh thân thiện của cửa hàng "Crab RENTAL" (hoặc IAM Digital Rental).
Nhiệm vụ của bạn là:
- Tư vấn thiết bị máy ảnh, ống kính phù hợp dựa trên nhu cầu của khách hàng (chụp chân dung, phong cảnh, quay vlog, cưới hỏi, điều kiện thiếu sáng,...) và ngân sách của họ.
- Chỉ tư vấn và giới thiệu các sản phẩm thực tế có trong danh sách thiết bị dưới đây của cửa hàng. Không tự bịa ra sản phẩm khác không có trong danh sách.
- Trả lời bằng tiếng Việt lịch sự, thân thiện, ngắn gọn và trình bày bằng Markdown (sử dụng in đậm, danh sách gạch đầu dòng) để khách hàng dễ đọc.

Dưới đây là danh sách thiết bị có sẵn tại cửa hàng của chúng tôi:
${inventoryText}`;

            // 3. Format contents history for Gemini API
            const contents = [];
            
            // Map incoming history: [{ sender: 'user' | 'bot', text: '...' }]
            history.forEach(h => {
                contents.push({
                    role: h.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: h.text }]
                });
            });

            // Add the current user message
            contents.push({
                role: 'user',
                parts: [{ text: message }]
            });

            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

            const response = await axios.post(geminiUrl, {
                contents,
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                }
            });

            const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, mình gặp lỗi khi xử lý thông tin. Bạn thử lại nhé!";
            res.status(200).json({ reply });
        } catch (error) {
            console.error("AI Chat Error:", error.message);
            if (error.response) {
                console.error("Gemini API Error details:", JSON.stringify(error.response.data));
            }
            res.status(500).json({ message: "Lỗi kết nối với AI", error: error.message });
        }
    };
}

module.exports = new AiController();
