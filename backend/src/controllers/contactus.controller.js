import ContactUs from "../models/contactus.model.js";
import mongoose from "mongoose";
import { sendEmail } from "../utils/sendEmail.js";

/* ============================================================
   📌 CREATE ContactUs (Public)
============================================================ */
export const createContactUs = async (req, res) => {
  try {
    const { type, name, email, phone, subject, message, meta, services } =
      req.body;
    console.log("Req.body: ", req.body);

    if (!type) {
      return res.status(400).json({
        status: "error",
        message: "Form type is required.",
      });
    }

    if (!name || !phone) {
      return res.status(400).json({
        status: "error",
        message: "Name & Phone are required.",
      });
    }

    if (services && Array.isArray(services)) {
      const isInvalid = services.some(
        (id) => !mongoose.Types.ObjectId.isValid(id),
      );

      if (isInvalid) {
        console.log("Invalid service id..");

        return res.status(400).json({
          status: "error",
          message: "Invalid Service ID detected.",
        });
      }
    }

    const contact = await ContactUs.create({
      type,
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      meta: meta || {},
      services: services || null,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      createdBy: req.user?._id || null,
    });

    // 📧 Send email notification to shop owner
   // 📧 Send email notification to shop owner
await sendEmail({
  subject: `New Inquiry: ${type} - ${name}`,
  html: `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f7; padding: 24px;">
    <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background-color: #1a1a1a; padding: 24px 32px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">
          🔔 New Inquiry Received
        </h1>
        <p style="color: #cccccc; margin: 4px 0 0; font-size: 13px;">
          Brisco — Website Notification
        </p>
      </div>

      <!-- Body -->
      <div style="padding: 32px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px; width: 130px;">Type</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-size: 14px; font-weight: 600;">${type}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-size: 14px; font-weight: 600;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-size: 14px; font-weight: 600;">
              <a href="tel:${phone}" style="color: #d97706; text-decoration: none;">${phone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-size: 14px;">${email || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Subject</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-size: 14px;">${subject || "N/A"}</td>
          </tr>
        </table>

        <div style="margin-top: 20px;">
          <p style="color: #888; font-size: 13px; margin: 0 0 6px;">Message</p>
          <div style="background-color: #f9f9fb; border-left: 3px solid #d97706; padding: 14px 16px; border-radius: 6px; color: #333; font-size: 14px; line-height: 1.6;">
            ${message || "No message provided."}
          </div>
        </div>

       
      </div>

      <!-- Footer -->
      <div style="background-color: #fafafa; padding: 16px 32px; border-top: 1px solid #eee; text-align: center;">
        <p style="color: #aaa; font-size: 12px; margin: 0;">
          This is an automated notification from Brisco website.
        </p>
      </div>
    </div>
  </div>
  `,
});

    return res.status(201).json({
      status: "success",
      message: "Form submitted successfully.",
      data: contact,
    });
  } catch (error) {
    console.error("❌ Error creating contact:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};

/* ============================================================
   📌 GET ALL ContactUs (Admin)
============================================================ */
export const getAllContactUs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await ContactUs.countDocuments();

    const messages = await ContactUs.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      status: "success",
      message: "Contact messages fetched successfully.",
      data: messages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching contact list:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};

/* ============================================================
   📌 GET ContactUs by ID
============================================================ */
export const getContactUsById = async (req, res) => {
  try {
    const contact = await ContactUs.findById(req.params.id).lean();

    if (!contact) {
      return res.status(404).json({
        status: "error",
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      status: "success",
      data: contact,
    });
  } catch (error) {
    console.error("❌ Error fetching contact:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};

/* ============================================================
   📌 PUT — Full Update
============================================================ */
export const updateContactUs = async (req, res) => {
  try {
    const data = req.body;

    const updated = await ContactUs.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ status: "error", message: "Contact not found." });
    }

    return res.status(200).json({
      status: "success",
      message: "Contact updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("❌ Error updating contact:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};

/* ============================================================
   📌 PATCH — Partial Update (status, read, etc.)
============================================================ */
export const partiallyUpdateContactUs = async (req, res) => {
  try {
    const data = req.body;

    const updated = await ContactUs.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true },
    );

    if (!updated) {
      return res
        .status(404)
        .json({ status: "error", message: "Contact not found." });
    }

    return res.status(200).json({
      status: "success",
      message: "Contact partially updated.",
      data: updated,
    });
  } catch (error) {
    console.error("❌ Error partial updating contact:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};

/* ============================================================
   📌 ADMIN Respond to Contact Message
============================================================ */
export const respondToContactUs = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Response message cannot be empty.",
      });
    }

    const contact = await ContactUs.findById(req.params.id);
    if (!contact) {
      return res
        .status(404)
        .json({ status: "error", message: "Contact not found." });
    }

    contact.response = {
      message,
      respondedBy: req.user._id,
      respondedAt: new Date(),
    };

    contact.replies.push({
      message,
      respondedBy: req.user._id,
    });

    contact.status = "answered";

    await contact.save();

    return res.status(200).json({
      status: "success",
      message: "Response added successfully.",
      data: contact,
    });
  } catch (error) {
    console.error("❌ Error responding contact:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};

/* ============================================================
   📌 DELETE ContactUs by ID
============================================================ */
export const destroyContactUsById = async (req, res) => {
  try {
    const deleted = await ContactUs.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Contact message deleted successfully.",
      data: deleted,
    });
  } catch (error) {
    console.error("❌ Error deleting contact:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};
