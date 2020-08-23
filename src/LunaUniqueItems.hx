import rm.objects.Game_Actor;
import core.Amaryllis;
import core.Types.JsFn;
import rm.objects.Game_Party;
import rm.types.RPG.BaseItem;
import rm.Globals;
import utils.Fn;
import utils.Comment;

using core.NumberExtensions;

class LunaUniqueItems {
 public static var textSpeed: Int = 2;

 public static function main() {
  // Plugin parameters can be include here as an internal call.
  Comment.title("Game_Party");

  var gamePartyGainItem: JsFn = Fn.getPrProp(Game_Party, "gainItem");
  var returningToInventory: Bool;
  var uniqueItemEmitter = Amaryllis.createEventEmitter();

  var RETURN_ITEM = "returnEquipItem";
  var RESET_RETURN = "resetReturn";

  uniqueItemEmitter.on(RETURN_ITEM, () -> {
   returningToInventory = true;
  });

  uniqueItemEmitter.on(RESET_RETURN, () -> {
   returningToInventory = false;
  });

  var oldChangeEquip: JsFn = Fn.getPrProp(Game_Actor, "changeEquip");
  Fn.setPrProp(Game_Actor, "changeEquip", (slotId: Int, item: BaseItem) -> {
   oldChangeEquip.call(Fn.self, slotId, item);
   uniqueItemEmitter.emit(RESET_RETURN);
  });

  var oldTradeItem: JsFn = Fn.getPrProp(Game_Actor, "tradeItemWithParty");
  Fn.setPrProp(Game_Actor, "tradeItemWithParty",
   (newItem: BaseItem, oldItem: BaseItem) -> {
    if (~/<\s*unique\s*/ig.match(oldItem.note)) {
     uniqueItemEmitter.emit(RETURN_ITEM);
    }
    oldTradeItem.call(Fn.self, newItem, oldItem);
   });

  Fn.setPrProp(Game_Party, "gainItem",

   (item: BaseItem, amount: Int, includeEquip: Bool) -> {
    var partySelf: Game_Party = Fn.self;
    // Party Has Item but no actor has it equipped
    if (~/<\s*unique\s*/ig.match(item.note)) {
     if (partyHasItem(item, true)) {
      if (returningToInventory) {
       gamePartyGainItem.call(Fn.self, item, amount.clamp(0, 1), includeEquip);
      } else {
       gamePartyGainItem.call(Fn.self, item, amount.clamp(-1, 0), includeEquip);
      }
     } else if (!partyHasItem(item, true)) {
      gamePartyGainItem.call(Fn.self, item, amount.clamp(-1, 1), includeEquip);
     }
    } else {
     gamePartyGainItem.call(Fn.self, item, amount, includeEquip);
    }
   });
 }

 public static function partyHasItem(item: BaseItem,
   includeEquip: Bool): Bool {
  return Globals.GameParty.hasItem(item, includeEquip);
 }
}
