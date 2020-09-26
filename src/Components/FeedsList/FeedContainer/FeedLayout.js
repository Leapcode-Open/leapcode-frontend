import React from 'react';
import Card from '../../Card';

const FeedLayout = (props) => {
    return (
        <Card className="p-4 mb-3">
            {props.children}
        </Card>
    )
}

export default FeedLayout