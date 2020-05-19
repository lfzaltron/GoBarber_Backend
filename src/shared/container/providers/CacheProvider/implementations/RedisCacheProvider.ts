import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';
import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
    private client: RedisClient;

    constructor() {
        this.client = new Redis(cacheConfig.config.redis);
    }

    public async save(key: string, value: any): Promise<void> {
        await this.client.set(key, JSON.stringify(value));
        console.log('RedisCacheProvider', 'save', key);
    }

    public async recover<T>(key: string): Promise<T | null> {
        console.log('RedisCacheProvider', 'recover', key);
        const data = await this.client.get(key);

        if (!data) {
            return null;
        }

        const parsedData = JSON.parse(data) as T;

        return parsedData;
    }

    public async invalidate(key: string): Promise<void> {
        console.log('RedisCacheProvider', 'invalidate', key);
        this.client.del(key);
    }

    public async invalidatePrefix(prefix: string): Promise<void> {
        console.log('RedisCacheProvider', 'invalidatePrefix', prefix);
        const keys = await this.client.keys(`${prefix}:*`);

        const pipeline = this.client.pipeline();

        keys.forEach(key => pipeline.del(key));

        await pipeline.exec();
    }
}
