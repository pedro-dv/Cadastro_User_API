import express from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express();
app.use(express.json()); // garantindo rodar um arquivo em json()



// ADICIONAR USER
app.post('/usuarios', async (req, res) => {
    await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })
});


// LISTAR USER
app.get('/usuarios', async (req, res) => {

    let users = []

    if (req.query){
        await prisma.user.findMany({
            where: {
                name: req.query.name,
                email: req.query.email,
                age: req.query.age
            },
        })
    }else{
        users = await prisma.user.findMany()
    }
    
 

    res.status(200).json(users)
    
});


// EDITAR USER (UPDATE)
app.put('/usuarios/:id', async (req, res) => {
    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })
    res.status(201).json(req.body)
})


// DELETE
app.delete('/usuarios/:id', async (req, res) => {
    await prisma.user.delete({
        where: {
            id: req.params.id
        },
    })
    res.status(200).json({message: 'Usuário deletado com Sucesso!'})
});




/* 
    Criar nossa API de Usuarios
    - criar usuário
    - listar usuários 
    - editar usuários
    - deletar usuários

    MungoDB 
    - senha : w6BlyX6tYDCx3xSl
    - user: Pedro-Menezes

*/

app.listen(3000, (err) => {
    if (err) {
        console.log("Erro ao Processar!")
    }else{
        console.log("Servidor rodando com sucesso!")
    }
});