import AdminJS, { ComponentLoader } from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Admin from "../models/adminModel.js";
import Ad from "../models/adModel.js";
import { canManage } from "./rolePermissions.js";
import bcrypt from "bcryptjs";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

dotenv.config();

const BACK_END_URL = process.env.BACK_END_URL;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

AdminJS.registerAdapter(AdminJSMongoose);
const componentLoader = new ComponentLoader();
componentLoader.add(
  "FileUpload",
  path.join(__dirname, "../components/FileUpload.jsx")
);


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
  locale: {
    translations: {
      labels: {
        Order: "Orders",
      },
      actions: {
        approve: "Approve",
        ship: "Ship",
      },
    },
  },
  resources: [
    {
      resource: Product,
      options: {
        navigation: "Shop",
        isAccessible: ({ currentAdmin }) =>
          canManage(currentAdmin?.role, "Product"),
        properties: {
          imageFile: {
            type: "file",
            isVirtual: true,
            isVisible: { list: false, edit: true, new: true, show: false },
            components: { edit: "FileUpload" },
          },

          imageUrl: {
            isVisible: { list: true, edit: false, show: true },
          },

        },

        actions: {
          new: {
            formidable: true,
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Product"),
            before: async (request) => {
              if (request.payload?.imageFile) {
                const { path, name, type } = request.payload.imageFile;

                const formData = new FormData();
                formData.append("image", fs.createReadStream(path),
                  {
                    filename: name,
                    contentType: type,
                  }
                );

                const responce = await axios.post(
                  BACK_END_URL + "/api/upload/upload-product-image",
                  formData,
                  {
                    headers: formData.getHeaders()
                  }
                );

                request.payload.imageUrl = responce.data.imageUrl;
                delete request.payload.imageFile;
              }
              return request;
            },
            after: async (responce) => {
              console.log("Image uploaded successfully");
              return responce;
            },
          },

          edit: {
            formidable: true,
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Product"),
            before: async (request) => {
              if (request.payload?.imageFile) {
                const { path, name, type } = request.payload.imageFile;

                const formData = new FormData();
                formData.append(
                  "image",
                  fs.createReadStream(path),
                  {
                    filename: name,
                    contentType: type,
                  }
                );
                const response = await axios.post(BACK_END_URL + "/api/upload/upload-product-image",
                  formData,
                  { headers: formData.getHeaders() }
                );
                request.payload.imageUrl = response.data.imageUrl;
                delete request.payload.imageFile;
              }
              return request;
            }
          },

          delete: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Product"),
          },
          bulkDelete: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Product"),
          },

          list: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Product"),
          },

          show: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Product"),
          },
        },
      },
    },

    {
      resource: Ad,
      options: {
        navigation: "Ad",
        isAccessible: ({ currentAdmin }) => canManage(currentAdmin?.role, "Ad"),
        properties: {
          adImage: {
            type: "file",
            isVirtual: true,
            isVisible: { list: false, edit: true, new: true, show: false, },
            label: "Ad image",
            components: { edit: "FileUpload" },
          },
          imageUrl: { isVisible: { list: true, edit: false, show: true } },
        },
        actions: {
          list: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Ad"),
          },
          show: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Ad"),
          },
          new: {
            formidable: true,
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Ad"),
            before: async (request) => {
              if (request.payload?.adImage) {
                const { path, name, type } = request.payload.adImage;

                const formData = new FormData();
                formData.append("image", fs.createReadStream(path), {
                  filename: name,
                  contentType: type,
                });

                const responce = await axios.post(
                  BACK_END_URL + "/api/upload/upload-ad-image",
                  formData,
                  {
                    headers: formData.getHeaders()
                  }
                );

                request.payload.imageUrl = responce.data.imageUrl;
                delete request.payload.adImage;
              }
              return request;
            },
            after: async (responce) => {
              console.log("Image uploaded successfully");
              return responce;
            },
          },
          edit: {
            formidable: true,
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Ad"),
            before: async (request) => {
              if (request.payload?.adImage) {
                const { path, name, type } = request.payload.adImage;

                const formData = new FormData();
                formData.append(
                  "image",
                  fs.createReadStream(path),
                  {
                    filename: name,
                    contentType: type,
                  }
                );

                const responce = await axios.post(
                  BACK_END_URL + "/api/upload/upload-ad-image",
                  formData,
                  { headers: formData.getHeaders() }
                );

                request.payload.imageUrl = responce.data.imageUrl;
                delete request.payload.adImage;
              }
              return request;
            }
          },
          delete: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Ad"),
          },
          bulkDelete: {
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
      resource: Admin,
      options: {
        navigation: "Admin",
        isAccessible: ({ currentAdmin }) =>
          currentAdmin?.role === "SUPER_ADMIN",
        properties: {
          password: {
            type: "password",
          },
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
      resource: Order,
      options: {
        navigation: "Orders",
        isAccessible: ({ currentAdmin }) =>
          canManage(currentAdmin?.role, "Order"),

        listProperties: [
          "productName",
          "userId",
          "price",
          "paymentMethod",
          "paymentStatus",
          "address",
          "status",
          "createdAt",
        ],
        properties: {
          paymentStatus: {
            isVisible: { list: true, filter: true, show: true, edit: true },
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
          show: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Order"),
          },
          new: {
            isAccessible: false,
          },
          edit: {
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin?.role, "Order"),
          },
          delete: {
            isAccessible: false,
          },
          bulkDelete: {
            isAccessible: false,
          },
          markUnpaid: {
            actionType: "record",
            component: false,
            label: "Mark Unpaid",
            icon: "Close",
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin.role, "Order"),
            handler: async (req, res, context) => {
              const { record, resource, h } = context;
              await record.update({ paymentStatus: "PENDING" });
              return {
                record: record.toJSON(context.currentAdmin),
                redirectUrl: h.resourceActionUrl({
                  resourceId: resource.id(),
                  actionName: "list",
                }),
                notice: {
                  message: "Payment status set to PENDING",
                  type: "info",
                },
              };
            },
          },

          markPaid: {
            actionType: "record",
            component: false,
            label: "Mark Paid",
            icon: "Checkmark",
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin.role, "Order"),
            handler: async (req, res, context) => {
              const { record, resource, h } = context;
              await record.update({ paymentStatus: "PAID" });
              return {
                record: record.toJSON(context.currentAdmin),
                redirectUrl: h.resourceActionUrl({
                  resourceId: resource.id(),
                  actionName: "list",
                }),
                notice: {
                  message: "Payment status set to PAID",
                  type: "success",
                },
              };
            },
          },
          approve: {
            actionType: "record",
            label: "Approve & Mark Paid",
            component: false,
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin.role, "Order"),
            handler: async (req, res, context) => {
              const { record, resource, h } = context;
              await record.update({
                status: "approved",
                paymentStatus: "PAID",
              });
              return {
                record: record.toJSON(context.currentAdmin),
                redirectUrl: h.resourceActionUrl({
                  resourceId: resource.id(),
                  actionName: "list",
                }),
                notice: {
                  message: "Order has been successfully approved!",
                  type: "success",
                },
              };
            },
          },

          deliver: {
            actionType: "record",
            component: false,
            label: "Mark Delivered",
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin.role, "Order"),
            handler: async (req, res, context) => {
              const { record, resource, h } = context;
              await record.update({ status: "delivered" });
              return {
                record: record.toJSON(context.currentAdmin),
                redirectUrl: h.resourceActionUrl({
                  resourceId: resource.id(),
                  actionName: "list",
                }),
                notice: {
                  message: "Order marked as Delivered!",
                  type: "success",
                },
              };
            },
          },
          ship: {
            actionType: "record",
            label: "Ship Order",
            component: false,
            isAccessible: ({ currentAdmin }) =>
              canManage(currentAdmin.role, "Order"),
            handler: async (req, res, context) => {
              const { record, resource, h } = context;
              await record.update({ status: "shipped" });
              return {
                record: record.toJSON(context.currentAdmin),
                redirectUrl: h.resourceActionUrl({
                  resourceId: resource.id(),
                  actionName: "list",
                }),
                notice: {
                  message: "Order has been successfully shipped!",
                  type: "success",
                },
              };
            },
          },
        },
        edit: {
          isAccessible: ({ currentAdmin }) =>
            canManage(currentAdmin?.role, "Order"),
        },
      },
    },
  ],
});

export default adminJs;
