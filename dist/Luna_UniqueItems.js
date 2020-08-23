//=============================================================================
// Luna_UniqueItems.js
//=============================================================================
//=============================================================================
// Build Date: 2020-08-23 19:11:00
//=============================================================================
//=============================================================================
// Made with LunaTea -- Haxe
//=============================================================================

//=============================================================================
//  Contact Information
//=============================================================================
/*
*
*
*/

// Generated by Haxe 4.1.3
/*:
@author LunaTechs - Kino
@plugindesc Allows you to tag database items as unique to prevent item stacking
<LunaUnqItm>.

@target MV MZ

@help
Version: 1.00
Introduction:
This plugin allows you to make an item unique and prevent
stacking of that same time.



Instructions:
Insert the notetag <unique> in that item's notebox
to trigger the effect.

Contact me via forums username: Kino.
Hope this plugin helps and enjoy!

MIT License
Copyright (c) 2020 LunaTechsDev
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE
*/
(function ($global) { "use strict"
class EReg {
	constructor(r,opt) {
		this.r = new RegExp(r,opt.split("u").join(""))
	}
	match(s) {
		if(this.r.global) {
			this.r.lastIndex = 0
		}
		this.r.m = this.r.exec(s)
		this.r.s = s
		return this.r.m != null;
	}
}
class LunaUniqueItems {
	static main() {
		
//=============================================================================
// Game_Party
//=============================================================================
      
		let gamePartyGainItem = Game_Party.prototype.gainItem
		let returningToInventory;
		let uniqueItemEmitter = new PIXI.utils.EventEmitter()
		let RETURN_ITEM = "returnEquipItem";
		let RESET_RETURN = "resetReturn"
		uniqueItemEmitter.on(RETURN_ITEM,function() {
			returningToInventory = true;
		})
		uniqueItemEmitter.on(RESET_RETURN,function() {
			returningToInventory = false;
		})
		let oldChangeEquip = Game_Actor.prototype.changeEquip
		Game_Actor.prototype.changeEquip = function(slotId,item) {
			oldChangeEquip.call(this,slotId,item)
			return uniqueItemEmitter.emit(RESET_RETURN);
		}
		let oldTradeItem = Game_Actor.prototype.tradeItemWithParty
		Game_Actor.prototype.tradeItemWithParty = function(newItem,oldItem) {
			if(new EReg("<\\s*unique\\s*","ig").match(oldItem.note)) {
				uniqueItemEmitter.emit(RETURN_ITEM)
			}
			return oldTradeItem.call(this,newItem,oldItem);
		}
		Game_Party.prototype.gainItem = function(item,amount,includeEquip) {
			this
			if(new EReg("<\\s*unique\\s*","ig").match(item.note)) {
				if(LunaUniqueItems.partyHasItem(item,true)) {
					if(returningToInventory) {
						gamePartyGainItem.call(this,item,Math.round(Math.min(Math.max(amount,0),1)),includeEquip)
					} else {
						gamePartyGainItem.call(this,item,Math.round(Math.min(Math.max(amount,-1),0)),includeEquip)
					}
				} else if(!LunaUniqueItems.partyHasItem(item,true)) {
					gamePartyGainItem.call(this,item,Math.round(Math.min(Math.max(amount,-1),1)),includeEquip)
				}
			} else {
				gamePartyGainItem.call(this,item,amount,includeEquip)
			}
		}
	}
	static partyHasItem(item,includeEquip) {
		return $gameParty.hasItem(item,includeEquip)
	}
}
class haxe_iterators_ArrayIterator {
	constructor(array) {
		this.current = 0
		this.array = array
	}
	hasNext() {
		return this.current < this.array.length;
	}
	next() {
		return this.array[this.current++];
	}
}
class _$LTGlobals_$ {
}
class utils_Fn {
	static proto(obj) {
		return obj.prototype;
	}
}
LunaUniqueItems.main()
})({})