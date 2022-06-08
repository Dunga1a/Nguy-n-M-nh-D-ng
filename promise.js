var users = [
        {
            id: 1,
            name: "nguyen nam"
        },
        {
            id: 2,
            name: "ha",
        },
        {
            id : 4,
            name: "hoa"
        }
    ];

    var comments = [
        {
            id: 1,
            user_id : 1,
            content: "hello"
        },
        {
            id: 2,
            user_id: 2,
            content: "hi"
        },
        {
            id: 3,
            user_id: 4,
            content: "how are you!"
        }
    ];
    function getComments(){
        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve(comments)
            },1000);
    
        });
    };
    
    function getUsersById(userIds){
        return new Promise(function(resolve) {
            var result = users.filter(function(user) {
                return userIds.includes(user.id);
            });
            setTimeout(function() {
                resolve(result);
            },1000);
        });
    }
    
    getComments()
        .then(function(comments) {
            var userIds = comments.map(function(comment) {
                return comment.user_id;
            });
            return getUsersById(userIds)
            .then(function(users) {
                return {
                    users: users,
                    comments: comments,
                };
            });
        })
    .then(function(data) {
        var commentBlock = document.getElementById("comment-block")
        var html = ''
        data.comments.forEach(function(comment) {
            var user = data.users.find(function(user) {
                return comment.user_id === user.id
            });
            html += `<li>${user.name}: ${comment.content}</li> `
        commentBlock.innerHTML = html;
        });
    });

    // FETCH
    var api_posts = "https://jsonplaceholder.typicode.com/posts";
    var api_users = "https://jsonplaceholder.typicode.com/users";
    var api_photos = "https://jsonplaceholder.typicode.com/photos";
    var api_comments = "https://jsonplaceholder.typicode.com/comments";
    // fetch(api_posts)
    //     .then(function(response) {
    //         return response.json()
    //         // .json sẽ thực hiện việc JSON.parse giùm
    //         // JSON -> Javascript types
    //         // response.json() sẽ là 1 Promise có trạng thái fulfilled(resolve())
    //         // nên sẽ nhảy vào then phía sau
    //     })
    //     .then(function(posts) {
    //         // Lấy ra các user đã up bài post
    //         var userIds = posts.map(function(post) {
    //             return post.userId;
    //         })
    //         return fetch(api_users)
    //             .then(function(response) {
    //                 return response.json() // Lấy được thông tin users
    //             })
    //             .then(function(users) {
    //                 // Lọc qua danh sách users, chỉ lấy những user có up bài
    //                 var listUsersHasPost = users.filter(function(user) {
    //                     return userIds.includes(user.id);
    //                 })
    //                 return {
    //                     users: listUsersHasPost,
    //                     posts: posts,
    //                 }
    //             })
    //     })
        

    //     .then(function(data) {
    //         var boxElement = document.getElementById("box");
    //         var html = '';
    //         data.users.forEach(function(user) {
    //             html += `<div><h1>POST OF ${user.name}</h1>`;
    //             var userPosts = data.posts.filter(function(post) {
    //                 return post.userId == user.id;
    //             });
    //             userPosts.forEach(function(userPost) {
    //                 html += `<h2>Title: ${userPost.title}</h2>`;
    //                 html += `<span>Content: ${userPost.body}</span>`;
    //                 // html += `<img src="${userPost.photos}/>"`;
    //             })
    //             html += "</div>";
    //         })
    //         boxElement.innerHTML = html;
    //     })

        
    fetch(api_users)
        .then(function(response) {
            return response.json()
        })
        .then(function(userResponse){
                var users = userResponse.map(function(user){
                    return {
                        id: user.id,
                        name: user.name
                    };
                })
                // console.log(userResponse)

        return fetch(api_photos)
            .then(function(respon) {
                return respon.json()
            })
            .then(function(photoResponse) {
                var photos = photoResponse.map(function(photo){
                    return {
                        photoId: photo.albumId,
                        title: photo.title,
                        URL: photo.url,
                    }
                })
                // console.log(photoResponse)
                console.log(photos)
                // console.log(users)
                return {
                    userList: users,
                    photoList: photos,
                }
                
            })
        })
        
        .then( function(data) { // Đẩy dữ liệu từ array sau khi lấy được từ JSON vào HTML
            var photoBlock = document.getElementById('photo');
            var html = '';
            var image = document.createElement('img')
            
            data.userList.forEach(function(users) {
                html += `<h1>POST OF ${users.name}</h1>`;
                var userPhotos = data.photoList.filter(function(photo) {
                    return photo.photoId === users.id;
                })
                
                userPhotos.forEach(function(userPhotos) {
                    return html += `<li>
                    <h2>Id: ${users.id}</h2>
                    <h3>Title: ${userPhotos.title}</h3>
                    
                    <img src="" alt="" style="max-width: 300px">
                    <img src="${userPhotos.thumbnailUrl}" alt="" style="max-width: 150px">
                    </li>`;
                
                    // html += `<img src="${userPost.photos}/>"`;
                })
                console.log(userPhotos)
                
            })
            photoBlock.innerHTML = html;
        })

    // fetch(api_users)
    //     .then(function(response) {
    //         return response.json()
    //     })
    //     .then(function(userResponse){
    //             var users = userResponse.map(function(user){
    //                 return {
    //                     id: user.id,
    //                     name: user.name
    //                 };
    //             })
    
    //         return fetch(api_comments)
    //         .then(function(respon) {
    //             return respon.json()
    //         })
    //         .then(function(commentResponse) {
    //             var comments = commentResponse.map(function(comment){
    //                 return {userId: comment.postId, body:comment.body}
    //             })
    //             // console.log(comments)
    //             // console.log(users)
    //             return {
    //                 userList: users,
    //                 commentList: comments
    //             }
                
    //         })
    //     })

    //     .then(function(data){
    //         var html='';
    //         data.userList.forEach(function(user) {
    //             var userr = data.commentList.filter(function(cmt) {
    //                 return cmt.userId === user.id
    //             })
        
    //             userr.forEach(function (item) {
    //                     return html += `
    //                     <p>${user.id} </p>
    //                     <p>Username: ${user.name} </p>
                    
    //                     <p>Content: ${item.body} </p>
    //                     `;
    //                 });
    //         })
    //         document.getElementById('comment').innerHTML = html
    //     })
    

        


        
        
        