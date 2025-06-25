import http from '../utils/http'
    
const paymentApi = {
    sendRedPacket(amount, targetId, totalCount, red_packets_type, payment_channel) {
        let param = {
            red_packets_amount: amount,
            target_id: targetId,
            total_count: totalCount,
            type: red_packets_type,
            payment_channel: payment_channel
        };
        return http.POST(`/payment-module/api/payment/red-packets/send`, param)
    }
}

export default paymentApi;