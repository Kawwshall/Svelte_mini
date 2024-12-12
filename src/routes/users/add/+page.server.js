let previewFormData
let userImage
async function preserveFormData ({request}) {
    const formData = await request.formData();
    const imageData = formData.getAll('userImage');
    // save user image
    userImage = imageData[0]

    // TODO Add Validation Logic (not added because of testing)

    // --- Testing Logs ---
    // console.log("This is form data in server", formData )
    // console.log("This is Image data in server",  imageData )
    // console.log("This is Image data in server",  imageData[0] instanceof Blob)
    let formObject = {
		userId: formData.get('userId'),
		userName: formData.get('userName'),
		userDesignation: formData.get('userDesignation'),
		userRole:formData.get('userRole') ,
		userPhoneNumber: formData.get('userPhoneNumber'),
		userEmail: formData.get('userEmail'),
        // userImage: imageData[0],
		permanentAddressLine1: formData.get('permanentAddressLine1'),
		permanentAddressLine2: formData.get('permanentAddressLine2'),
		permanentAddressCityTown:formData.get('permanentAddressCityTown'),
		permanentAddressState: formData.get('permanentAddressState'),
		permanentAddressPincode: formData.get('permanentAddressPincode'),
		currentAddressLine1: formData.get('currentAddressLine1'),
		currentAddressLine2: formData.get('currentAddressLine2'),
		currentAddressCityTown:formData.get('currentAddressCityTown'),
		currentAddressState: formData.get('currentAddressState'),
		currentAddressPincode:formData.get('currentAddressPincode'),
        currentAddressSameAsPermanent: formData.get('currentAddressSameAsPermanent') || false
	}; 
    // console.log("Form formObject", formObject)
    // save the preview form in server 
	previewFormData = formObject
    
    return {saved: true, formData: formObject}
}

async function saveFormData({request}){
    // TODO handle saving data to databse here...

    // ---- Testing logs until APIs are integrated ----
    // console.log("Saving form to database... ", previewFormData)
    // console.log("User Image...", userImage)
    return {
        formSaved: true,
        message: 'form saved successfully'
    }
}
export const actions = {
    review: preserveFormData,
    final: saveFormData
}