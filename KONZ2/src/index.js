import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logging from './helpers/Logging.js';
import { Schema } from 'zod';
import mysql from 'mysql2/promise';
import Logging from './helpers/Logging.js';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());


const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
  }); 


const postRouter = express.Router();

const PORT = process.env.PORT;
const data = [
    {
        id: 1,
        post: 'hello world',
        author: 'KONZ'
    },
    {
        id: 2,
        post: 'hello world 2',
        author: 'KONZ 2'
    },
    {
        id: 3,
        post: 'hello world 3',
        author: 'KONZ 3'
    }
]


postRouter.get ('/', async(req, res) => {
    try {
        const [data] = await connection.query('SELECT * FROM posts  ');

        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'succes retrieve posts data ',
            data
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            statusCode: 500,
            message: `${error}`,
        });
    }
})


// postRouter.get ('/posts', (req, res) => {
//     try {
//         return res.status(200).json({
//             status: true,
//             statusCode: 200,
//             message: 'succes retrieve posts data ',
//             data
//         })
//     } catch (error) {
//         return res.status(500).json({
//             status: false,
//             statusCode: 500,
//             message: `${error}`,
//         });
//     }
// })

postRouter.get ('/:id', async(req, res) => {
    const {id} = req.params
    try {
        const sql = `select * from posts where id = ?`;
        const values = [id];
    
        const [data] = await connection.query(sql, values);
        
        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'succes retrieve posts detail data ',
            data 
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            statusCode: 500,
            message: `${error}`,
        });
    }
})


postRouter.post ('/', async(req, res) => {
    
    console.log(req.body)
    const {content} = req.body

    if (!content) {
        return res.status(404).json({
            status: false,
            statusCode: 404,
            message: 'some filed and missing',
        });
    }

    
    try {
        const sql = `insert into posts (content) values (?)`;
        const values = [content];
        const [data] = await connection.query(sql, values);

        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'succes create posts data ',
            data 
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            statusCode: 500,
            message: `${error}`,
        });
    }
})

postRouter.put ('/:id', async(req, res) => {
    // const {post, authorId} = req.body
    // if(!(post && authorId)){
    //     return res.status(404).json({
    //         status: false,
    //         statusCode: 404,
    //         message:'some filed and missing',     
    //     })
    // }
    const {content} = req.body
    const {id} = req.params
    
    try {
        const sql = `update posts set content = ? where id = ?`;
        const values = [content, id];
        const [data] = await connection.query(sql, values); 

        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'succes update posts data ',
            data
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            statusCode: 500,
            message: `${error}`,
        });
    }
})

postRouter.patch ('/:id', async(req, res) => {
    const {content} = req.body
    const {id} = req.params
    try {
        const sql = `update posts set content = ? where id = ?`;
        const values = [content, id];
        const [data] = await connection.execute(sql, values);

        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'succes update posts data ',
            data
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            statusCode: 500,
            message: `${error}`,
        });
    }
})


postRouter.delete ('/:id', async(req, res) => {
    const {id} = req.params
    
    try {
        const sql = `delete from posts where id = ?`;
        const values = [id];
        const [data] = await connection.execute(sql, values);
        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'succes delete posts data ',
            data 
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            statusCode: 500,
            message: `${error}`,
        });
    }
})

app.use('/posts', postRouter)


app.listen(PORT, () => {
    Logging.info(`Example app listening on http://localhost:${PORT}`)
})