import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Posts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/api/posts')
            .then(response => setPosts(response.data))
            .catch(error => console.error("Error fetching posts", error));
    }, []);

    return (
        <div>
            <h1> Posts </h1>
            <ul>
                {posts.map(post => (
                    <li key = {post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        </li>
                ))}
            </ul>
        </div>
    );
};

export default Posts;