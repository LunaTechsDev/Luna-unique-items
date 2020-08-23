import macros.MacroTools;
import rm.managers.PluginManager;
import utils.Fn;
import utils.Comment;

using core.StringExtensions;
using Std;

class LunaUniqueItems {
 public static var textSpeed: Int = 2;

 public static function main() {
  // Plugin parameters can be include here as an internal call.
  // MacroTools.includeJsLib("./src/TestPluginParams.js");

  var parameters: Any = PluginManager.parameters("TestPlugin");
  textSpeed = Fn.getByArrSyntax(parameters, "Text Speed");
  trace(textSpeed);
 }
}
