const {
  isFileTypeSupported,
  uploadFileToCloudinary,
} = require("../services/cloudinary");

const fileUploadCloudnary = async (req, res) => {
  try {
    console.log(req.files);
    const { file } = req.files;
    const supportedFileTypes = ["jpeg", "png", "jpg"];
    const fileType = file?.name?.split(".")[1].toLowerCase();
    if (!isFileTypeSupported(fileType, supportedFileTypes)) {
      return res
        .status(400)
        .json({ success: false, message: "File format not supported" });
    }

    const response = await uploadFileToCloudinary(file, "RealTimeChatApp");
    console.log(response);
    const fileUrl = response?.secure_url;
    res.status(200).json({
      success: true,
      message: "File Uploaded Successfully",
      data: fileUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  fileUploadCloudnary,
};
