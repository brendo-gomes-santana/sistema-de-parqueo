const Router = require('express');
const { v4: uuidv4 } = require('uuid');
const { Payment, MercadoPagoConfig } = require('mercadopago');

require('dotenv').config();

const routes = Router()

routes.post('/pix', async (req, res) => {
    
    const client = new MercadoPagoConfig({ accessToken: process.env.TOKEN });
    const payment = new Payment(client);

    const { valor, descricao, email, number_cpf } = req.body;

    payment.create({
        body: {
            transaction_amount: valor,
            description: descricao,
            payment_method_id: 'pix',
            payer: {
                email: email,
                identification: {
                    type: 'CPF',
                    number: number_cpf
                }
            }
        },
        requestOptions: { idempotencyKey: uuidv4() }
    })
        .then((result) => {
            return res.json(result)
        })
        .catch((error) => {
            console.log(error);
            return res.status(401).json({
                error: 'Algo deu errado'
            })
        });
})

module.exports = routes;
