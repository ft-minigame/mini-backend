import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Game } from 'src/v1/game/domain/models/game.entity';
import { FindAllRankResponse } from '../../response/findAllRank.response';
import { FindOneRankResponse } from '../../response/findOneRank.response';

@Injectable()
export class RankRepository extends Repository<Game> {
  constructor(private dataSources: DataSource) {
    super(Game, dataSources.createEntityManager());
  }

  async findAll(): Promise<FindAllRankResponse[]> {
    const games = await this.find({ relations: ['user'] });

    return games.map((game) => ({
      nickname: game.nickname,
      score: game.score,
      coalitions: game.user.coalitions,
      createdAt: game.createdAt,
      intraId: game.user.intraId,
    }));
  }

  async findOneByIntraId(intraId: string): Promise<FindOneRankResponse> {
    try {
      const game = await this.createQueryBuilder('game')
        .innerJoin('game.user', 'user')
        .where('user.intraId = :intraId', { intraId })
        .getOne();

      if (!game) {
        throw new Error(`No game found with intraId: ${intraId}`);
      }

      return {
        createdAt: game.createdAt,
        score: game.score,
        nickname: game.nickname,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
