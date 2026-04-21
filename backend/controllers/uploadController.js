import { v2 as cloudinary } from "cloudinary";

export const uploadImage = async (req, res) => {
  try {
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message:
          'No file uploaded. Make sure request is multipart/form-data with key "image".',
      });
    }

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    res.json({ success: true, image_url: imageUpload.secure_url });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const uploadPDF = async (req, res) => {
  try {
    const pdfFile = req.file;

    if (!pdfFile) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp file PDF qua form-data với key là "pdf".',
      });
    }

    // Chỉ cho phép định dạng PDF
    if (pdfFile.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Chỉ hỗ trợ upload file có định dạng PDF.",
      });
    }

    // Upload lên Cloudinary với resource_type raw hoặc auto
    const pdfUpload = await cloudinary.uploader.upload(pdfFile.path, {
      resource_type: "auto", // auto thường hỗ trợ tốt cả raw document
      folder: "math_exams", // Lưu gọn vào folder
    });

    res.status(200).json({
      success: true,
      fileUrl: pdfUpload.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server khi upload PDF",
    });
  }
};

export const uploadImages = async (req, res) => {
  try {
    const imageFiles = req.files;

    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          'Vui lòng cung cấp ít nhất một file ảnh qua form-data với key là "images".',
      });
    }

    const uploadPromises = imageFiles.map((file) =>
      cloudinary.uploader.upload(file.path, { resource_type: "image" }),
    );

    const uploadResults = await Promise.all(uploadPromises);
    const urls = uploadResults.map((result) => result.secure_url);

    res.json({
      success: true,
      message: `Upload thành công ${urls.length} ảnh`,
      urls,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const uploadPDFs = async (req, res) => {
  try {
    const pdfFiles = req.files;

    if (!pdfFiles || pdfFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          'Vui lòng cung cấp ít nhất một file PDF qua form-data với key là "pdfs".',
      });
    }

    // Kiểm tra định dạng PDF
    const invalidFiles = pdfFiles.filter(
      (f) => f.mimetype !== "application/pdf",
    );
    if (invalidFiles.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Tất cả file phải có định dạng PDF.",
      });
    }

    const uploadPromises = pdfFiles.map((file) =>
      cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        folder: "math_exams",
      }),
    );

    const uploadResults = await Promise.all(uploadPromises);
    const urls = uploadResults.map((result) => result.secure_url);

    res.status(200).json({
      success: true,
      message: `Upload thành công ${urls.length} files`,
      fileUrls: urls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server khi upload PDF",
    });
  }
};
