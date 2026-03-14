import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, MongoRepository } from "typeorm";
import { LinkEntity } from "./link.entity";

@Injectable()
export class LinkRepository {
  constructor(
    @InjectRepository(LinkEntity)
    private readonly linkRepository: MongoRepository<LinkEntity>,
  ) {}

  public delete(link: LinkEntity): Promise<DeleteResult> {
    return this.linkRepository.delete({ ID: link.ID });
  }

  public async findPreviousLinkByPosition(position: number, userId: string): Promise<LinkEntity | null> {
    const links = await this.linkRepository.find({
      where: { position: { $lt: position }, userId },
      order: { position: "DESC" },
      take: 1,
    });

    return links[0] ?? null;
  }

  public async findNextLinkByPosition(position: number, userId: string): Promise<LinkEntity | null> {
    const links = await this.linkRepository.find({
      where: { position: { $gt: position }, userId },
      order: { position: "ASC" },
      take: 1,
    });

    return links[0] ?? null;
  }

  public findLastLinkByUserId(userId: string): Promise<LinkEntity | null> {
    return this.linkRepository.findOne({ where: { userId }, order: { position: "DESC" } });
  }

  public count(): Promise<number> {
    return this.linkRepository.count();
  }

  public findByUserId(userId: string, order: "DESC" | "ASC"): Promise<LinkEntity[]> {
    return this.linkRepository.find({ where: { userId }, order: { position: order } });
  }

  public findOneById(id: string): Promise<LinkEntity | null> {
    return this.linkRepository.findOne({ where: { ID: id } });
  }

  public save(link: LinkEntity): Promise<LinkEntity> {
    return this.linkRepository.save(link);
  }
}
