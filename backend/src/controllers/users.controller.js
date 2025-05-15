import {  asyncHandler } from '../utils/asyncHandller.js';
import { User }	from '../models/user.models.js';
import { ApiError } from '../utils/apiError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
 



//1. Register the user 
const registerUser = asyncHandler(async (req, res) => {

	//1. get the data from the request 
	
	const { fullName, email, password, phoneNumber } = req.body;

	//2. validate the data
	if([ fullName, email, password, phoneNumber ].some( (field) => field?.trim === "")) {
		throw new ApiError(400, "All filelds are required for register the user ")	
	};
	
	//3. check if the user already exists
	const existedUser = await User.findOne({$or : [ {email : email.toLowerCase()}, {phoneNumber} ]});
	if(existedUser){
			throw new ApiError(400, "User already exists")
	}


	//4.upload on the local storage 
	const avatarLocaPath = req.file?.avatar[0]?.path;
	if(!avatarLocaPath){
		throw new ApiError(400, "Avatar is required")
	}


	//5. upload avatar on cloudinary 
	const avatar = await uploadOnCloudinary(avatarLocaPath);
	if(!avatar){
		throw new ApiError(400, "Avatar is required")
	}


	//6. create the user 
	const user = await User.create({
		fullName,
		email : email.toLowerCase(),
		password,
		phoneNumber, 
		avatar: avatar.url
	})


	//7. send the response 
	const createdUser = await User.findById(user._id).select("-password -refreshToken")

	if(!createdUser){
  		throw new ApiError(400 , "Something went wrong while registerin the user"); 
	}

	return res.status(201).json( new ApiResponse(201 , createdUser , "User registered successfully"));


}); 

const loginUser = asyncHandler(async (req, res) => {

	//1. get the data from the request
	const { email, phoneNumber ,password } = req.body;

	//2. validate the data
	if(!(email || phoneNumber)) {
		throw new ApiError(400, " Email or phone number is required "); 
	}

	//3. check weather the user exists or not 
	const user = await User.finddOne({$or : [{email : email.toLowerCase()}, {phoneNumber}]});
	if(!user){
		throw new ApiError(400, "User does not exists");
	}

	//4. check the password 
	const isPasswordMatch = await user.isPasswordMatch(password); 
	if(!isPasswordMatch){
		throw new ApiError(400, "Password is incorrect");
	}

	//5. generate the access token and refresh token
	const { accessToken , refreshToken} = await user.generateAccessTokenAndRefreshToken();
	const loggedInUser = await User.findById(user._id).select("-password -refreshToken");


	
	// 7. send the response through cookies 	

	const options = {
 	 httpOnly : true,
  	secure : true,
	}

	///8. Send the response 
	return res.status(200)
	.cookie("accessToken", accessToken, options)
	.cookie("refreshToken", refreshToken, options)
	.json(new ApiResponse(200, loggedInUser, "User logged in successfully"));


}); 

const generateAccessTokenAndRefreshToken = async( req, res ) =>{
	
	try {
		const user = await User.findById(userId);
		if(!user){
			throw new ApiError(400, "User does not exists");
		}
	
		const accessToken = user.generateAccessToken(); 
		const refreshToken = user.generateRefreshToken();
	
		user.refreshToken = refreshToken;
	   	await user.save(); 
	   	return { accessToken , refreshToken };
		
	} catch (error) {
	    console.log("Error in generating access and refresh token ", error);
    	throw new ApiError(500 , "Internal Server Error");
	}
	
	
}
 

export { registerUser, 
			loginUser
 };