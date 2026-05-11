import React from "react";
import { Card } from "react-bootstrap";
import { Link } from 'react-router-dom';
import Rating from './Rating';
const Product = ({ product }) => {
    return (
        <Card className="my-3 p-3 rounded">
            <Link to={`/product/${product.id}`}>
            <Card.Img src={product.image} variant="top" style={{height: '250px', objectFit:'cover'}} />
            </Link>

            <Card.Body>
                <Link to={`/product/${product.id}`}>
                 <Card.Title as="div"
                     style={{minHeighth: '50px'}} > <strong>{product.name}</strong></Card.Title>
                </Link>
                <Card.Text as="div">
                    <Rating value={product.rating} text={`${product.numReviews} let review for dev`} />
                </Card.Text>
                <Card.Text as="h3">{product.price} RSD</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Product