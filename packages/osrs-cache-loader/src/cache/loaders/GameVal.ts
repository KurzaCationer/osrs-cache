import { CacheProvider } from "../Cache";
import { Loadable } from "../Loadable";
import { Reader } from "../Reader";
import { GameValID } from "../types";

const decoder = new TextDecoder("utf-8");

export class GameVal extends Loadable {
	constructor(public gameValID: GameValID, public otherID: number) {
		super();
	}

	public static readonly index = 24;

	public name!: string;
	public files?: Map<number, string> = undefined;

	public static async loadData(
		cache: CacheProvider,
		gameValID: GameValID,
		otherID: number,
	): Promise<Reader | undefined> {
		let archive = await cache.getArchive(this.index, gameValID);
		let version = await cache.getVersion(this.index);
		let data = archive?.getFile(otherID)?.data;
		return data ? new Reader(data, version) : undefined;
	}

	public static async nameFor(
		cache: CacheProvider,
		obj: { id: number; },
	): Promise<string | undefined> {
		let clazz = obj?.constructor;
		if (clazz && "gameval" in clazz) {
			let gv = await (this as any).load(cache, (clazz as any).gameval, obj.id);
			return gv?.name;
		}
		return undefined;
	}

	public static decode(r: Reader, gameValID: GameValID, otherID: number): GameVal {
		const v = new GameVal(gameValID, otherID);

		switch (gameValID) {
			case 10: {
				// DBTable
				r.u8(); // always 1, very useful

				v.name = r.string();
				let files = v.files = new Map();

				for (let id = 0;; id++) {
					let counter = r.u8();
					if (counter == 0 && isEnd(r)) {
						break;
					}

					files.set(id, r.string());
				}
				break;
			}
			case 13: {
				// legacy widget
				v.name = r.string();
				let files = v.files = new Map();
				let msb = 0;
				let lastId = 0;

				for (;;) {
					let id = r.u8();
					if (id == 255 && isEnd(r)) {
						break;
					}
					if (id < lastId) {
						msb += 0x100;
					}
					lastId = id;

					files.set(msb + id, r.string());
				}
				break;
			}
			case 14: {
				// widget
				v.name = r.string();
				let files = v.files = new Map();

				for (;;) {
					let id = r.u16();
					if (id === 0xFFFF) {
						break;
					}

					files.set(id, r.string());
				}
				break;
			}
			default:
				v.name = decoder.decode(r.view);
		}

		return v;
	}
}

function isEnd(r: Reader) {
	let off = r.offset;
	for (; r.offset < r.length;) {
		if (r.u8() != 0) {
			r.offset = off;
			return false;
		}
	}

	return true;
}
