"use strict";

module.exports = {
  async exportCsv(ctx) {
    const items = await strapi.db.query("api::inquiry.inquiry").findMany({
      orderBy: { createdAt: "desc" },
    });

    const rows = [
      [
        "ticket_id",
        "inquiry_type",
        "name",
        "company",
        "email",
        "phone",
        "country",
        "product_interest",
        "application",
        "status",
        "source_page",
      ].join(","),
      ...items.map((item) =>
        [
          item.ticket_id,
          item.inquiry_type,
          item.name,
          item.company,
          item.email,
          item.phone ?? "",
          item.country ?? "",
          item.product_interest,
          item.application,
          item.status,
          item.source_page ?? "",
        ]
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ];

    ctx.set("Content-Type", "text/csv; charset=utf-8");
    ctx.set("Content-Disposition", 'attachment; filename="inquiries.csv"');
    ctx.body = rows.join("\n");
  },
};
