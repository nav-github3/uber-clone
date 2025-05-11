const asyncHandler = fn => (err, req, res, next) =>{
	Promise.resolve(fn(req, res, next)).catch( err => { 
		console.log(err)
		res.status(500).json({
			success: false,
			message: err.message
		})
	})
}

export { asyncHandler }