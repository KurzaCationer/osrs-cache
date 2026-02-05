
import { describe, it } from 'vitest';
import { Cache } from './index';
import { ConfigLoader } from './loaders';

describe('Debug NPC', () => {
  it('should dump NPC 1', async () => {
    const cache = await Cache.load({ game: 'oldschool' });
    const loader = new ConfigLoader(cache, 2, 9);
    const npc1Data = await loader.getFile(1);
    console.log('NPC 1 Raw Data Length:', npc1Data?.length);
    if (npc1Data) {
      console.log('NPC 1 Raw Data (first 20 bytes):', Array.from(npc1Data.slice(0, 20)));
    }
    
    const npcs = await cache.getAssets('npc');
    const npc1 = npcs.find(n => n.id === 1);
    console.log('NPC 1:', JSON.stringify(npc1, null, 2));
  });
});
