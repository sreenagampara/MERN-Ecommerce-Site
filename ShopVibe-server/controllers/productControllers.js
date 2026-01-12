import Product from "../models/productModel.js";

export const searchProducts = async (req, res) => {
  try {
    const {
      q = "",
      category,
      division,
      subCategory,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    
    if (q.trim()) {
      filter.$text = { $search: q };
    }

    
    if (category) {
      filter.category = category;
    }

  
    if (subCategory) {
      filter.subCategory = subCategory;
    }

    
    if (division) {
      filter.division = division;
    }

    
    if (minPrice || maxPrice) {
      filter.$expr = {
        $and: [
          minPrice
            ? { $gte: [{ $toDouble: "$price" }, Number(minPrice)] }
            : { $gte: [{ $toDouble: "$price" }, 0] },

          maxPrice
            ? { $lte: [{ $toDouble: "$price" }, Number(maxPrice)] }
            : { $lte: [{ $toDouble: "$price" }, 999999] }
        ]
      };
    }

    const products = await Product.find(
      filter,
      q ? { score: { $meta: "textScore" } } : {}
    )
      .sort(q ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product search failed",
      error: error.message
    });
  }
};
