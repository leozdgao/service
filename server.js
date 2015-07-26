import express from 'express';
import serviceRouter from './services/router';

const app = express();

app.use('/service', serviceRouter);

// handle error
app.use((err, req, res, next) => {
  res.status(500).json({msg: err.message || 'Unknown Error.'});
});

export default app;
