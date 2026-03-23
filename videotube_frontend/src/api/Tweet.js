import api from "./axios";

export const getTweets=async(userId)=>{
    const response=await api.get(`/tweets/user/${userId}`);
    return response
}

export const createTweet=async(content)=>{
    const response=await api.post('/tweets',{
        content:content
    })
    return response
}

export const deleteTweets=async(tweetId)=>{
    const response=await api.delete(`/tweets/${tweetId}`);
    return response
}

export const updateTweet=async(tweetId,content)=>{
    const response=await api.patch(`/tweets/${tweetId}`,{
        content:content
    })

    return response
}