import api from "./axios";

export const updateNameAndEmail=async(fullName,email)=>{
  const response=await api.patch(`/users/update-account`,{
    fullName,
    email
  });
  return response;
};

export const updateAvatar=async(avatar)=>{
  const formData = new FormData();
  formData.append("avatar", avatar);

  const response=await api.patch(`/users/avatar`,formData);
  return response;
};

export const updateCoverImage=async(coverImage)=>{
  const formData=new FormData();
  formData.append("coverImage", coverImage);

  const response=await api.patch(`/users/cover-image`,formData);
  return response;
};

export const updatePassword=async(oldPassword,newPassword)=>{
    const response=await api.post(`/users/change-password`,{
        oldPassword,
        newPassword
    })
    return response
}