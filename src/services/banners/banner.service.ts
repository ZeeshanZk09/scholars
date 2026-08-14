import { NotFoundError } from "@/lib/errors";
import { BannerRepository, type BannerAdmin, type BannerPublic } from "@/repositories/banners";
import type { CreateBannerInput, UpdateBannerInput } from "@/schemas/banner/banner.schema";
import type { ApiUser } from "@/server/auth/route-guard";

export class BannerService {
  private readonly bannerRepository: BannerRepository;

  constructor(bannerRepository = new BannerRepository()) {
    this.bannerRepository = bannerRepository;
  }

  async listPublished(): Promise<BannerPublic[]> {
    return this.bannerRepository.listPublished();
  }

  async listForAdmin(options: { skip: number; take: number; status?: string }) {
    return this.bannerRepository.listAll({
      skip: options.skip,
      take: options.take,
      status: options.status as BannerAdmin["status"] | undefined,
    });
  }

  async getById(id: string): Promise<BannerAdmin> {
    const banner = await this.bannerRepository.findById(id);

    if (!banner) {
      throw new NotFoundError("Banner not found.");
    }

    return banner;
  }

  async create(input: CreateBannerInput, actor: ApiUser): Promise<{ id: string }> {
    return this.bannerRepository.create({
      title: input.title,
      subtitle: input.subtitle || null,
      description: input.description || null,
      imageUrl: input.imageUrl,
      linkUrl: input.linkUrl || null,
      ctaLabel: input.ctaLabel || null,
      startDate: input.startDate ?? null,
      endDate: input.endDate ?? null,
      status: input.status,
      displayOrder: input.displayOrder,
      createdById: actor.id,
    });
  }

  async update(id: string, input: UpdateBannerInput, actor: ApiUser): Promise<BannerAdmin> {
    const banner = await this.bannerRepository.update(id, {
      ...input,
      linkUrl: input.linkUrl === undefined ? undefined : input.linkUrl || null,
      ctaLabel: input.ctaLabel === undefined ? undefined : input.ctaLabel || null,
      startDate: input.startDate === undefined ? undefined : input.startDate,
      endDate: input.endDate === undefined ? undefined : input.endDate,
      updatedById: actor.id,
    });

    if (!banner) {
      throw new NotFoundError("Banner not found.");
    }

    return banner;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.bannerRepository.softDelete(id);

    if (!deleted) {
      throw new NotFoundError("Banner not found.");
    }
  }
}
