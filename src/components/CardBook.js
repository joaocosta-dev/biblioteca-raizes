import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';

import { Link } from 'react-router-dom';

export default function MultiActionAreaCard({
  bookTitle,
  bookDescript,
  bookImage,
  bookLink,
  showCancelButton,
  onCancel
}) {
  return (
    <Card sx={{ maxWidth: 345, boxShadow: '0 25px 50px -12px #000' }}>
      <CardActionArea>
        <CardMedia
          component="img"
          image={bookImage}
          alt="green iguana"
          className="max-h-[195px]"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {bookTitle}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {bookDescript}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="medium"
          color="primary"
          sx={{ color: 'white', backgroundColor: '#04332D' }}
        >
          <Link to={bookLink}>Ver mais</Link>
        </Button>
        {showCancelButton && (
          <Button variant="contained" color="error" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
