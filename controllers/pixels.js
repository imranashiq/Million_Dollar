const Pixel = require("../models/pixels");

exports.createPixel = async (req, res) => {
    try {
        const { userId, selectedPixels } = req.body;
        
        if (!userId || !selectedPixels) {
            return res.status(400).json({ success: false, message: "User ID and selected pixels are required" });
        }
        
        const pixel = new Pixel({ userId, selectedPixels });
        await pixel.save();
        
        return res.status(201).json({ success: true, message: "Pixel selection created successfully", data: pixel });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

exports.getPixelsByUser = async (req, res) => {
    try {
        const { userId } = req.user;
        
        const pixels = await Pixel.find({ userId });
        return res.status(200).json({ success: true, data: pixels });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

exports.getAllPixels = async (req, res) => {
    try {      
        const pixels = await Pixel.find({ });
        return res.status(200).json({ success: true, data: pixels });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

exports.updatePixel = async (req, res) => {
    try {
        const { pixelId } = req.params;
        const { selectedPixels } = req.body;
        
        const pixel = await Pixel.findByIdAndUpdate(pixelId, { selectedPixels }, { new: true });
        if (!pixel) {
            return res.status(404).json({ success: false, message: "Pixel selection not found" });
        }
        
        return res.status(200).json({ success: true, message: "Pixel selection updated successfully", data: pixel });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

exports.deletePixel = async (req, res) => {
    try {
        const { pixelId } = req.params;
        
        const pixel = await Pixel.findByIdAndUpdate(pixelId,{
            permanentDeleted:true
        });
        if (!pixel) {
            return res.status(404).json({ success: false, message: "Pixel selection not found" });
        }
        
        return res.status(200).json({ success: true, message: "Pixel selection deleted successfully" });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
