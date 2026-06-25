"use strict";

module.exports = {
  async findOneBySlug(ctx) {
    const item = await strapi.db.query("api::partner-profile.partner-profile").findOne({
      where: {
        slug: ctx.params.slug,
      },
      populate: {
        certifications: true,
        products: true,
      },
    });

    if (!item) {
      return ctx.notFound("Partner profile not found");
    }

    ctx.body = {
      data: {
        id: item.id ?? null,
        documentId: item.documentId ?? null,
        partner_name: item.partner_name ?? null,
        slug: item.slug ?? null,
        overview: item.overview ?? null,
        capabilities: item.capabilities ?? [],
        lab_capabilities: item.lab_capabilities ?? [],
        disclaimer: item.disclaimer ?? null,
        certifications: (item.certifications ?? []).map((certification) => ({
          id: certification.id ?? null,
          documentId: certification.documentId ?? null,
          name: certification.name ?? null,
          issuer: certification.issuer ?? null,
          valid_until: certification.valid_until ?? null,
          applies_to: certification.applies_to ?? [],
        })),
        related_products: (item.products ?? []).map((product) => ({
          id: product.id ?? null,
          documentId: product.documentId ?? null,
          name: product.name ?? null,
          slug: product.slug ?? null,
        })),
        locale: item.locale ?? null,
      },
    };
  },
};
