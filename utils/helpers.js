//truncate

const truncate = (post) =>{
    if (post.length>100){
        return post.substring(0,100)+'...'
    }
    return post;
}

export default truncate