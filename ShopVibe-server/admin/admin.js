import AdminJS, { ComponentLoader } from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Admin from "../models/adminModel.js";
import Ad from "../models/adModel.js";
import { canManage } from "./rolePermissions.js";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

AdminJS.registerAdapter(AdminJSMongoose);

const componentLoader = new ComponentLoader();

const FILE_UPLOAD_COMPONENT = componentLoader.add(
  "FileUpload",
  path.join(__dirname, "../components/FileUpload.jsx")
);

const handleCloudinaryUpload = async (file, folder) => {
  if (!file || !file.path) return null;
  try {
    const uploadResponse = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: "auto",
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error(`Cloudinary ${folder} Upload Error:`, error);
    throw new Error("Failed to upload image to cloud storage.");
  }
};

const adminJs = new AdminJS({
  componentLoader,
  branding: {
    companyName: "ShopVibe Admin",
    softwareBrothers: false,
    theme: {
      colors: {
        primary100: "#00090d",
        accent: "#03a9fc",
        bg: "#03a9fc",
      },
    },
  },
  rootPath: "/admin",
  resources: [
    {
      resource: Admin,
      options: {
        navigation: "System",
        // RESTORED: Only SUPER_ADMIN can see the Admin resource
        isAccessible: ({ currentAdmin }) =>
          currentAdmin?.role === "SUPER_ADMIN",
        properties: {
          password: { type: "password" },
        },
        actions: {
          list: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin?.role === "SUPER_ADMIN",
          },
          new: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload.password = await bcrypt.hash(
                  request.payload.password,
                  10
                );
              }
              return request;
            },
            isAccessible: ({ currentAdmin }) =>
              currentAdmin?.role === "SUPER_ADMIN",
          },
          edit: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload.password = await bcrypt.hash(
                  request.payload.password,
                  10
                );
              } else {
                delete request.payload.password;
              }
              return request;
            },
            isAccessible: ({ currentAdmin }) =>
              currentAdmin?.role === "SUPER_ADMIN",
          },
          delete: {
            isAccessible: ({ currentAdmin }) =>
              currentAdmin?.role === "SUPER_ADMIN",
          },
        },
      },
    },
    {
      resource: Product,
      options: {
        navigation: "Shop",
        // RESTORED: Use rolePermissions.js to check access
        isAccessible: ({ currentAdmin }) =>
          canManage(currentAdmin?.role, "Product"),
        properties: {
          imageFile: {
            type: "file",
            isVirtual: true,
            isVisible: { list: false, edit: true, new: true, show: false },
            components: { edit: FILE_UPLOAD_COMPONENT },
          },
          imageUrl: { isVisible: { list: true, edit: false, show: true } },
        },
        actions: {
          // RESTORED: 'new' and 'edit' are explicitly enabled and checked
          new: {
            formidable: true,
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Product"),
            before: async (request) => {
              if (request.payload?.imageFile) {
                request.payload.imageUrl = await handleCloudinaryUpload(
                  request.payload.imageFile,
                  "products"
                );
                delete request.payload.imageFile;
              }
              return request;
            },
          },
          edit: {
            formidable: true,
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Product"),
            before: async (request) => {
              if (request.payload?.imageFile) {
                request.payload.imageUrl = await handleCloudinaryUpload(
                  request.payload.imageFile,
                  "products"
                );
                delete request.payload.imageFile;
              }
              return request;
            },
          },
          list: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Product"),
          },
          show: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Product"),
          },
          delete: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Product"),
          },
        },
      },
    },
    {
      resource: Ad,
      options: {
        navigation: "Marketing",
        isAccessible: ({ currentAdmin }) => canManage(currentAdmin?.role, "Ad"),
        properties: {
          adImage: {
            type: "file",
            isVirtual: true,
            isVisible: { list: false, edit: true, new: true, show: false },
            label: "Ad Image",
            components: { edit: FILE_UPLOAD_COMPONENT },
          },
          imageUrl: { isVisible: { list: true, edit: false, show: true } },
        },
        actions: {
          new: {
            formidable: true,
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Ad"),
            before: async (request) => {
              if (request.payload?.adImage) {
                request.payload.imageUrl = await handleCloudinaryUpload(
                  request.payload.adImage,
                  "ads"
                );
                delete request.payload.adImage;
              }
              return request;
            },
          },
          edit: {
            formidable: true,
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Ad"),
            before: async (request) => {
              if (request.payload?.adImage) {
                request.payload.imageUrl = await handleCloudinaryUpload(
                  request.payload.adImage,
                  "ads"
                );
                delete request.payload.adImage;
              }
              return request;
            },
          },
          list: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Ad"),
          },
        },
      },
    },
    {
      resource: User,
      options: {
        navigation: "Users",
        listProperties: [
          "name",
          "email",
          "password",
          "isAccountVerified",
          "cart",
          "orders",
        ],

        isAccessible: ({ currentAdmin }) =>
          canManage(currentAdmin?.role, "User"),
        actions: {
          list: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "User"),
          },
          new: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload.password = await bcrypt.hash(
                  request.payload.password,
                  10
                );
              }

              return request;
            },
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "User"),
          },

          show: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "User"),
          },

          edit: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload.password = await bcrypt.hash(
                  request.payload.password,
                  10
                );
              } else {
                delete request.payload.password;
              }
              return request;
            },
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "User"),
          },
          delete: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "User"),
          },
        },
      },
    },
    {
      resource: Order,
      options: {
        navigation: "Sales",
        isAccessible: ({ currentAdmin }) =>
          canManage(currentAdmin?.role, "Order"),
        properties: {
          paymentStatus: {
            availableValues: [
              { value: "PENDING", label: "Pending" },
              { value: "PAID", label: "Paid" },
              { value: "FAILED", label: "Failed" },
            ],
          },
          status: {
            availableValues: [
              { value: "new", label: "New" },
              { value: "approved", label: "Approved" },
              { value: "shipped", label: "Shipped" },
              { value: "delivered", label: "Delivered" },
            ],
          },
        },
        actions: {
          list: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Order"),
          },
          edit: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Order"),
          },
          show: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Order"),
          },
        },
      },
    },
  ],
});

if (process.env.NODE_ENV === "production") {
  adminJs.initialize().then(() => {
    console.log("AdminJS bundled and initialized for production");
  });
}

export default adminJs;
