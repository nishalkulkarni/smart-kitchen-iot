import React from 'react';
import {Link} from 'react-router-dom'
import { motion } from 'framer-motion';

export default function DashCard({route,title}) {
    return (
        <motion.div layout whileHover={{ scale: 1.2 }} >
            <Link to = {route} style={{textDecoration:'none'}}>
                <div className="dash-card">
                    <h1>{title}</h1>
                </div>
            </Link>
        </motion.div>
    )
}
