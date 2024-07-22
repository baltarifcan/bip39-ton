import { hash, codec } from "sjcl";
import wordlist from "./wordlist";

 function splitWords(mnemonic) {
    return mnemonic.split(/\s/g).filter(function (x) {
      return x.length;
    });
  }
  function zfill(source, length) {
    source = source.toString();
    while (source.length < length) {
      source = "0" + source;
    }
    return source;
  }
   function mnemonicToBinaryString(mnemonic) {
    var mnemonic = splitWords(mnemonic);
    if (mnemonic.length == 0 || mnemonic.length % 3 > 0) {
      return null;
    }
    // idx = map(lambda x: bin(self.wordlist.index(x))[2:].zfill(11), mnemonic)
    var idx = [];
    for (var i = 0; i < mnemonic.length; i++) {
      var word = mnemonic[i];
      var wordIndex = wordlist.indexOf(word);
      if (wordIndex == -1) {
        return null;
      }
      var binaryIndex = zfill(wordIndex.toString(2), 11);
      idx.push(binaryIndex);
    }
    return idx.join("");
  }
   function binaryStringToWordArray(binary) {
    var aLen = binary.length / 32;
    var a = [];
    for (var i = 0; i < aLen; i++) {
      var valueStr = binary.substring(0, 32);
      var value = parseInt(valueStr, 2);
      a.push(value);
      binary = binary.slice(32);
    }
    return a;
  }
   function hexStringToBinaryString(hexString) {
    let binaryString = "";
    for (var i = 0; i < hexString.length; i++) {
      binaryString += zfill(parseInt(hexString[i], 16).toString(2), 4);
    }
    return binaryString;
  }
  
   const check = function (mnemonic) {
    var b = mnemonicToBinaryString(mnemonic);
    if (b === null) {
      return false;
    }
    var l = b.length;
    //d = b[:l / 33 * 32]
    //h = b[-l / 33:]
    var d = b.substring(0, (l / 33) * 32);
    var h = b.substring(l - l / 33, l);
    //nd = binascii.unhexlify(hex(int(d, 2))[2:].rstrip('L').zfill(l / 33 * 8))
    var nd = binaryStringToWordArray(d);
    //nh = bin(int(hashlib.sha256(nd).hexdigest(), 16))[2:].zfill(256)[:l / 33]
    var ndHash = hash.sha256.hash(nd);
    var ndHex = codec.hex.fromBits(ndHash);
    var ndBstr = zfill(hexStringToBinaryString(ndHex), 256);
    var nh = ndBstr.substring(0, l / 33);
    return h == nh;
  };

  export default check;