// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


/**
  * Copyright 2017 www.wuhaichao.com
  * Auto-generated:2017/8/19 下午4:27:29
  *
  * @author www.wuhaichao.com (whc)
  * @website http://wuhaichao.com
  * @github https://github.com/netyouli
  */

var WHCValueType = {
    _Int        : 0,
    _Float      : 1,
    _Boolean    : 2,
    _String     : 3,
    _Array      : 4,
    _Dictionary : 5,
    _Null       : 6
};

function WHCValue(value) {
    this.type = WHCValueType._Null;
    if (this.isString(value)){
        this.type = WHCValueType._String;
    }else if (this.isInt(value)) {
        this.type = WHCValueType._Int;
    }else if (this.isFloat(value)) {
        this.type = WHCValueType._Float;
    }else if (this.isBoolean(value)) {
        this.type = WHCValueType._Boolean;
    }else if (this.isArray(value)) {
        this.type = WHCValueType._Array;
    }else if (value != null) {
        this.type = WHCValueType._Dictionary;
    }
}

WHCValue.prototype.isArray = function(value) {
    return value != null &&
    typeof value === 'object' &&
    typeof value.length === 'number' && 
    typeof value.splice === 'function' &&
    !(value.propertyIsEnumerable('length'));
};

WHCValue.prototype.isString = function(value) {
    return value != null &&
    typeof value === 'string';
}

WHCValue.prototype.isBoolean = function(value) {
    return value != null &&
    typeof value === 'boolean';
}

WHCValue.prototype.isInt = function(value) {
    return value != null &&
    typeof value === 'number' &&
    value === parseInt(value);
}

WHCValue.prototype.isFloat = function(value) {
    return value != null &&
    typeof value === 'number' &&
    value === parseFloat(value);
}

WHCValue.prototype.isObject = function(value) {
    return value != null &&
    value instanceof Object;
}

var WHCParserLanguage = {
    Swift              : 0,
    SwiftClass         : 6,
    SwiftSexyJson      : 7,
    SwiftSexyJsonClass : 8,
    OC                 : 1,
    Java               : 2,
    Python             : 3,
    Kotlin             : 4,
    CNet               : 5,
    Unknown            : 6,

    /**
     * 返回语言描述
     */
    desc : function (type) {
        switch (type) {
            case this.Python:
                return 'Python'
            case this.Kotlin:
                return 'Kotlin'
            case this.Swift:
                return 'Swift'
            case this.CNet:
                return 'C#'
            case this.Java:
                return 'Java'
            case this.SwiftClass:
                return 'SwiftClass'
            case this.SwiftSexyJson:
                return 'SwiftSexyJson'
            case this.SwiftSexyJsonClass:
                return 'SwiftSexyJsonClass'
            case this.OC:
                return 'Objective-c'
            default:
                return 'unkown'
        }
    }
};

function WHCJsonParser(type) {
    this.type = type;
    this.classImplementation = '';
    this.classHeader = '';
    this.rootClassName = 'WHC' 
    this.isExistArray = false;
    this.kJavaSetGetString = '    public void setWHCPROPERTY(WHCTYPE WHCProperty){\n\
        this.WHCProperty = WHCProperty;\n\
    }\n\
    public WHCTYPE getWHCPROPERTY(){\n\
        return this.WHCProperty;\n\
    }\n';
}

WHCJsonParser.prototype.keyCount = function(value) {
    let valueInfo = new WHCValue(value);
    switch (valueInfo.type) {
        case WHCValueType._Array: {
            return value.length;
        }
        case WHCValueType._Dictionary: {
            let count = 0;
            for (let k in value) {
                count += 1;
            }
            return count;
        }
        default:
            return 0;
    }
};

WHCJsonParser.prototype.makeClassName = function(key) {
    let key_len = key.length;
    if (key_len > 0) {
        return key.charAt(0).toLocaleUpperCase() + (key_len > 1 ? key.substr(1, key.length - 1) : '');
    }
};

WHCJsonParser.prototype.makeLowerName = function(key) {
    let key_len = key.length;
    if (key_len > 0) {
        return key.charAt(0).toLocaleLowerCase() + (key_len > 1 ? key.substr(1, key.length - 1) : '');
    }
};

WHCJsonParser.prototype.arrayElementType = function(key, element) {
    let elementInfo = new WHCValue(element);
    switch (this.type) {
        case WHCParserLanguage.Swift:
        case WHCParserLanguage.SwiftClass:
        case WHCParserLanguage.SwiftSexyJson:
        case WHCParserLanguage.SwiftSexyJsonClass:
            switch (elementInfo.type) {
                case WHCValueType._String: {
                    return 'String';
                }
                case WHCValueType._Int: {
                    return 'Int';
                }
                case WHCValueType._Float: {
                    return 'CGFloat';
                }
                case WHCValueType._Boolean: {
                    return 'Bool';
                }
                case WHCValueType._Dictionary: {
                    return this.makeClassName(key);
                }
                case WHCValueType._Array: {
                    if (element.length > 0) {
                        return '[' + this.arrayElementType(key, element[0]) + ']'
                    }
                    return 'Any'
                }
            }       
            break;
        case WHCParserLanguage.OC: 
            switch (elementInfo.type) {
                case WHCValueType._String: {
                    return 'NSString *';
                }
                case WHCValueType._Int:
                case WHCValueType._Float:
                case WHCValueType._Boolean: {
                    return 'NSNumber *';
                }
                case WHCValueType._Dictionary: {
                    return this.makeClassName(key) + ' *';
                }
                case WHCValueType._Array: {
                    if (element.length > 0) {
                        return 'NSArray<' + this.arrayElementType(key, element[0]) + ' *> *';
                    }
                    return 'NSObject *'
                }
            }
            break;
        case WHCParserLanguage.Java:
            switch (elementInfo.type) {
                case WHCValueType._Null:
                case WHCValueType._String: {
                    return 'String';
                }
                case WHCValueType._Int: {
                    return 'Integer';
                }
                case WHCValueType._Float: {
                    return 'Float';
                }
                case WHCValueType._Boolean: {
                    return 'Boolean';
                }
                case WHCValueType._Dictionary: {
                    return this.makeClassName(key);
                }
                case WHCValueType._Array: {
                    if (element.length > 0) {
                        return 'List<' + this.arrayElementType(key, element[0]) + '>'
                    }
                    return 'Object'
                }
            }   
            break;
        case WHCParserLanguage.CNet:
            switch (elementInfo.type) {
                case WHCValueType._Null:
                case WHCValueType._String: {
                    return 'string';
                }
                case WHCValueType._Int: {
                    return 'int';
                }
                case WHCValueType._Float: {
                    return 'float';
                }
                case WHCValueType._Boolean: {
                    return 'bool';
                }
                case WHCValueType._Dictionary: {
                    return this.makeClassName(key);
                }
                case WHCValueType._Array: {
                    if (element.length > 0) {
                        return 'List<' + this.arrayElementType(key, element[0]) + '>'
                    }
                    return 'Object'
                }
            }
            break;
        default:
            break;
    }
}

WHCJsonParser.prototype.makeSetGetMothod = function(proType, key, keytype) {
    let setget = '';
    switch (this.type) {
        case WHCParserLanguage.SwiftSexyJson:
        case WHCParserLanguage.SwiftSexyJsonClass:
            setget = '      ' + this.makeLowerName(key) + '    <<<    ' + 'map["' + key + '"]\n';
            break;
        case WHCParserLanguage.Java: {
            setget = this.kJavaSetGetString.replace(/WHCTYPE/g,keytype);
            setget = setget.replace(/WHCPROPERTY/g,this.makeClassName(key));
            setget = setget.replace(/WHCProperty/g,this.makeLowerName(key));
        }
            break;
        default:
            break;
    }
    return setget;
};

WHCJsonParser.prototype.firstLower = function(key) {
    if (key != null && key.length > 0) {
        let first = key.charAt(0)
        return key.charAt(0).toLowerCase() + key.substr(1, key.length - 1)
    }
    return '';
}

WHCJsonParser.prototype.makeProperty = function(proType, key, value) {
    let property_str = '';
    let setget_str = '';
    switch (this.type) {
        case WHCParserLanguage.Swift:
        case WHCParserLanguage.SwiftClass:
        case WHCParserLanguage.SwiftSexyJson:
        case WHCParserLanguage.SwiftSexyJsonClass:
            switch (proType) {
                case WHCValueType._Null:
                case WHCValueType._String: {
                    setget_str = this.makeSetGetMothod(proType,key,'String');
                    property_str = '    var ' + this.makeLowerName(key) + ': String!\n';
                    break;
                }
                case WHCValueType._Int: {
                    setget_str = this.makeSetGetMothod(proType,key,'Int');
                    property_str = '    var ' + this.makeLowerName(key) + ': Int = 0\n';
                    break;
                }
                case WHCValueType._Float: {
                    setget_str = this.makeSetGetMothod(proType,key,'CGFloat');
                    property_str = '    var ' + this.makeLowerName(key) + ': CGFloat = 0\n';
                    break;
                }
                case WHCValueType._Boolean: {
                    setget_str = this.makeSetGetMothod(proType,key,'Bool');
                    property_str = '    var ' + this.makeLowerName(key) + ': Bool = false\n';
                    break;
                }
                case WHCValueType._Dictionary: {
                    setget_str = this.makeSetGetMothod(proType,key,this.makeClassName(key));
                    property_str = '    var ' + this.makeLowerName(key) + ': ' + this.makeClassName(key) + "!\n";
                    break;
                }
                case WHCValueType._Array: {
                    let valueInfo = new WHCValue(value);
                    switch (valueInfo.type) {
                        case WHCValueType._String:
                            setget_str = this.makeSetGetMothod(proType,key,'[String]');
                            property_str = '    var ' + this.makeLowerName(key) + ': [String]!\n';
                            break;
                        case WHCValueType._Int:
                            setget_str = this.makeSetGetMothod(proType,key,'[Int]');
                            property_str = '    var ' + this.makeLowerName(key) + ': [Int]!\n';
                            break;
                        case WHCValueType._Float:
                            setget_str = this.makeSetGetMothod(proType,key,'[CGFloat]');
                            property_str = '    var ' + this.makeLowerName(key) + ': [CGFloat]!\n';
                            break;
                        case WHCValueType._Boolean:
                            setget_str = this.makeSetGetMothod(proType,key,'[Bool]');
                            property_str = '    var ' + this.makeLowerName(key) + ': [Bool]!\n';
                            break;
                        case WHCValueType._Dictionary:
                            setget_str = this.makeSetGetMothod(proType,key,'[' + this.makeClassName(key) + ']');
                            property_str = '    var ' + this.makeLowerName(key) + ': [' + this.makeClassName(key) + ']!\n';
                            break;
                        case WHCValueType._Array:
                            if (value.length > 0) {
                                setget_str = this.makeSetGetMothod(proType,key,'[' + this.arrayElementType(key, value[0]) + ']');
                                property_str = '    var ' + this.makeLowerName(key) + ': [' + this.arrayElementType(key, value[0]) + ']!\n';
                                break;
                            }
                            setget_str = this.makeSetGetMothod(proType,key,'[Any]');
                            property_str = '    var ' + this.makeLowerName(key) + ': [Any]!\n';
                            break;
                    }
                }
                    break;
                default:
                    break;
            }
            break;
        case WHCParserLanguage.OC:
            switch (proType) {
                case WHCValueType._Null:
                case WHCValueType._String: {
                    property_str = '@property (nonatomic ,copy)NSString * ' + key + ';\n';
                    break;
                }
                case WHCValueType._Int: {
                    property_str = '@property (nonatomic ,assign)NSInteger  ' + key + ';\n';
                    break;
                }
                case WHCValueType._Float: {
                    property_str = '@property (nonatomic ,assign)CGFloat  ' + key + ';\n';
                    break;
                }
                case WHCValueType._Boolean: {
                    property_str = '@property (nonatomic ,assign)BOOL  ' + key + ';\n';
                    break;
                }
                case WHCValueType._Dictionary: {
                    property_str = '@property (nonatomic ,strong)' + this.makeClassName(key) + ' * ' + key + ';\n';
                    break;
                }
                case WHCValueType._Array: {
                    let valueInfo = new WHCValue(value);
                    switch (valueInfo.type) {
                        case WHCValueType._String:
                            property_str = '@property (nonatomic ,copy)NSArray<NSString *> * ' + key + ';\n';
                            break;
                        case WHCValueType._Int:
                        case WHCValueType._Float:
                        case WHCValueType._Boolean:
                            property_str = '@property (nonatomic ,copy)NSArray<NSNumber *> * ' + key + ';\n';
                            break;
                        case WHCValueType._Dictionary:
                            property_str = '@property (nonatomic ,copy)NSArray<' + this.makeClassName(key) + ' *> * ' + key + ';\n';
                            break;
                        case WHCValueType._Array:
                            if (value.length > 0) {
                                property_str = '@property (nonatomic ,copy)NSArray<' + this.arrayElementType(key, value[0]) + '> * ' + key + ';\n';
                                break;
                            }
                            property_str = '@property (nonatomic ,copy)NSArray<NSObject *> * ' + key + ';\n';
                            break;
                    }
                }
                    break;
                default:
                    break;
            }
            break;
        case WHCParserLanguage.Java:
            switch (proType) {
                case WHCValueType._Null:
                case WHCValueType._String: {
                    setget_str = this.makeSetGetMothod(proType,key,'String');
                    property_str = '    private    String    ' + this.makeLowerName(key) + ';\n';
                    break;
                }
                case WHCValueType._Int: {
                    setget_str = this.makeSetGetMothod(proType,key,'int');
                    property_str = '    private    int    ' + this.makeLowerName(key) + ';\n';
                    break;
                }
                case WHCValueType._Float: {
                    setget_str = this.makeSetGetMothod(proType,key,'float');
                    property_str = '    private    float    ' + this.makeLowerName(key) + ';\n';
                    break;
                }
                case WHCValueType._Boolean: {
                    setget_str = this.makeSetGetMothod(proType,key,'boolean');
                    property_str = '    private    boolean    ' + this.makeLowerName(key) + ';\n';
                    break;
                }
                case WHCValueType._Dictionary: {
                    setget_str = this.makeSetGetMothod(proType,key,this.makeClassName(key));
                    property_str = '    private    ' + this.makeClassName(key) + '    ' + this.makeLowerName(key) + ';\n';
                    break;
                }
                case WHCValueType._Array: {
                    let valueInfo = new WHCValue(value);
                    switch (valueInfo.type) {
                        case WHCValueType._String:
                            setget_str = this.makeSetGetMothod(proType,key,'List<String>');
                            property_str = '    private    List<String>    ' + this.makeLowerName(key) + ';\n';
                            break;
                        case WHCValueType._Int:
                            setget_str = this.makeSetGetMothod(proType,key,'List<Integer>');
                            property_str = '    private    List<Integer>    ' + this.makeLowerName(key) + ';\n';
                            break;
                        case WHCValueType._Float:
                            setget_str = this.makeSetGetMothod(proType,key,'List<Float>');
                            property_str = '    private    List<Float>    ' + this.makeLowerName(key) + ';\n';
                            break;
                        case WHCValueType._Boolean:
                            setget_str = this.makeSetGetMothod(proType,key,'List<Boolean>');
                            property_str = '    private    List<Boolean>    ' + this.makeLowerName(key) + ';\n';
                            break;
                        case WHCValueType._Dictionary:
                            setget_str = this.makeSetGetMothod(proType,key,'List<' + this.makeClassName(key) + '>');
                            property_str = '    private    List<' + this.makeClassName(key) + '>    ' + this.makeLowerName(key) + ';\n';
                            break;
                        case WHCValueType._Array:
                            if (value.length > 0) {
                                setget_str = this.makeSetGetMothod(proType,key,'List<' + this.arrayElementType(key, value[0]) + '>');
                                property_str = '    private    List<' + this.arrayElementType(key, value[0]) + '>    ' + this.makeLowerName(key) + ';\n';
                                break;
                            }
                            setget_str = this.makeSetGetMothod(proType,key,'List<Object>');
                            property_str = '    private    List<Object>    ' + this.makeLowerName(key) + ';\n';
                            break;
                    }
                }
                    break;
                default:
                    break;
            }
            break;
        case WHCParserLanguage.CNet:
            switch (proType) {
                case WHCValueType._Null:
                case WHCValueType._String: {
                    property_str = '    public    string    ' + key + '{set; get;}\n';
                    break;
                }
                case WHCValueType._Int: {
                    property_str = '    public    int    ' + key + '{set; get;}\n';
                    break;
                }
                case WHCValueType._Float: {
                    property_str = '    public    float    ' + key + '{set; get;}\n';
                    break;
                }
                case WHCValueType._Boolean: {
                    property_str = '    public    bool    ' + key + '{set; get;}\n';
                    break;
                }
                case WHCValueType._Dictionary: {
                    property_str = '    public    ' + this.makeClassName(key) + '    ' + key + '{set; get;}\n';
                    break;
                }
                case WHCValueType._Array: {
                    let valueInfo = new WHCValue(value);
                    switch (valueInfo.type) {
                        case WHCValueType._String:
                            property_str = '    public    List<string>    ' + key + '{set; get;}\n';
                            break;
                        case WHCValueType._Int:
                            property_str = '    public    List<int>    ' + key + '{set; get;}\n';
                            break;
                        case WHCValueType._Float:
                            property_str = '    public    List<float>    ' + key + '{set; get;}\n';
                            break;
                        case WHCValueType._Boolean:
                            property_str = '    public    List<bool>    ' + key + '{set; get;}\n';
                            break;
                        case WHCValueType._Dictionary:
                            property_str = '    public    List<' + this.makeClassName(key) + '>    ' + key + '{set; get;}\n';
                            break;
                        case WHCValueType._Array:
                            if (value.length > 0) {
                                property_str = '    public    List<' + this.arrayElementType(key, value[0]) + '>    ' + key + '{set; get;}\n';
                                break;
                            }
                            property_str = '    private    List<Object>    ' + key + '{set; get;}\n';
                            break;
                    }
                }
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return [property_str, setget_str];
};

WHCJsonParser.prototype.makeClassBeginTxt = function(key) {
    let begin_txt = '';
    switch (this.type) {
        case WHCParserLanguage.Swift:
             begin_txt = '//MARK: - ' + key + ' -\n\n';
             begin_txt += 'struct ' + this.makeClassName(key) + ' {\n';  
             break;
        case WHCParserLanguage.SwiftClass:
             begin_txt = '//MARK: - ' + key + ' -\n\n';
             begin_txt += 'class ' + this.makeClassName(key) + ' {\n';  
             break;
        case WHCParserLanguage.SwiftSexyJson:
             begin_txt = '//MARK: - ' + key + ' -\n\n';
             begin_txt += 'struct ' + this.makeClassName(key) + ':SexyJson {\n';  
             break;
        case WHCParserLanguage.SwiftSexyJsonClass:
             begin_txt = '//MARK: - ' + key + ' -\n\n';
             begin_txt += 'class ' + this.makeClassName(key) + ':SexyJson {\n';  
             break;
        case WHCParserLanguage.OC:
             this.classImplementation += '#pragma mark - ' + key + ' -\n\n';
             this.classImplementation += '@implementation ' + this.makeClassName(key) + '\n\n@end\n\n';
             begin_txt = '#pragma mark - ' + key + ' -\n\n';
             begin_txt += '@interface ' + this.makeClassName(key) + ': NSObject\n';
             break;
        case WHCParserLanguage.Java:
        case WHCParserLanguage.CNet:
             begin_txt = '/*===========' + key +'===========*/\n\n';
             begin_txt += 'public class ' + this.makeClassName(key) + ' {\n'; 
             break;
        default:
             return '';
    }
    return begin_txt;
};

WHCJsonParser.prototype.addDidParsedContent = function(content) {
    switch (this.type) {
        case WHCParserLanguage.OC:
            this.classHeader += content;
            break;
        default:
            this.classImplementation += content;
            break;
    }
};

WHCJsonParser.prototype.makeClassEndTxt = function() {
    switch (this.type) {
        case WHCParserLanguage.Swift:
        case WHCParserLanguage.SwiftClass:
        case WHCParserLanguage.SwiftSexyJson:
        case WHCParserLanguage.SwiftSexyJsonClass:
        case WHCParserLanguage.Java:
        case WHCParserLanguage.CNet:
             return '}\n\n';
        case WHCParserLanguage.OC:
             return '@end\n\n';
        default:
             return '';
     }
};

WHCJsonParser.prototype.executeParseEngine = function(object, class_name) {
    let result = '';
    let setget = '\n';
    for (let key in object) {
        let value = object[key];
        let valueInfo = new WHCValue(value);
        switch (valueInfo.type) {
            case WHCValueType._Array: {
                this.isExistArray = true;
                let property_info = this.makeProperty(valueInfo.type, key, value);
                result += property_info[0];
                setget += property_info[1];
                let content = '';
                if (value.length > 0) {
                    let max_element = null;
                    for (let i in value) {
                        let element = value[i];
                        if (max_element == null) {
                            max_element = element;
                        }else if (this.keyCount(max_element) < this.keyCount(element)) {
                            max_element = element;
                        }
                    }
                    if (max_element) {
                        let max_element_info = new WHCValue(max_element);
                        switch (max_element_info.type) {
                            case WHCValueType._Array:
                            case WHCValueType._Dictionary:
                                content += this.makeClassBeginTxt(key);
                                content += this.executeParseEngine(max_element, key);
                                content += this.makeClassEndTxt();
                                this.addDidParsedContent(content);
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
                break;
            case WHCValueType._Dictionary: {
                let property_info = this.makeProperty(valueInfo.type, key, value);
                result += property_info[0];
                setget += property_info[1];
                let content = this.makeClassBeginTxt(key);
                if (content.length > 0) {
                    content += this.executeParseEngine(value, key);
                }
                content += this.makeClassEndTxt();
                this.addDidParsedContent(content);
            }
                break;
            case WHCValueType._String:
            case WHCValueType._Null:
            case WHCValueType._Int:
            case WHCValueType._Float:
            case WHCValueType._Boolean: {
                let property_info = this.makeProperty(valueInfo.type, key, value);
                result += property_info[0];
                setget += property_info[1]; 
            }
                break;
            default:
                break;
        }
    }
    if (setget && setget != '\n') {
        switch (this.type) {
            case WHCParserLanguage.SwiftSexyJson: {
                let sexy_map = '\n    public mutating func sexyMap(_ map: [String : Any]) {\n';
                sexy_map += setget;
                sexy_map += '\n   }\n';
                result += sexy_map;
                break;
            }
            case WHCParserLanguage.SwiftSexyJsonClass: {
                let sexy_map = '\n    public func sexyMap(_ map: [String : Any]) {\n';
                sexy_map += setget;
                sexy_map += '\n   }\n';
                result += sexy_map;
                break;
            }
            default:
                result += setget;
                break;
        }
    }
    return result;
};

WHCJsonParser.prototype.startParser = function(json) {
    if (json.length > 0) {
        let json_object = JSON.parse(json);
        if (json_object) {
            switch (this.type) {
                case WHCParserLanguage.OC:
                    this.classHeader = this.makeFileRightText();
                    break;
                default:
                    break;
            }
            this.classImplementation = this.makeFileRightText();
            let content = this.makeClassBeginTxt(this.rootClassName);
            content += this.executeParseEngine(json_object, '');
            switch (this.type) {
                case WHCParserLanguage.Java:
                    if (this.isExistArray) {
                        this.classImplementation = 'package ;\n\
import java.util.ArrayList;\n\
import java.util.List;\n' + this.classImplementation;
                    }else {
                        this.classImplementation = 'package ;\n' + this.classImplementation;
                    }
                    break;
                default:
                    break;
            }
            content += this.makeClassEndTxt();
            content += '\n\n\n\n';
            this.addDidParsedContent(content);
        }
    }else {
        console.log('json string not empty');
    }
    return [this.classHeader, this.classImplementation];
};

WHCJsonParser.prototype.makeFileRightText = function() {
    let date = new Date();
    let year = date.getFullYear();
    let generatedDate = date.toLocaleString();
    return '\n\n/**\n  * Copyright ' + year + ' wuhaichao.com\n  * Auto-generated:' + generatedDate + '\n  *\n' + '  * @author wuhaichao.com (whc)\n' + '  * @website http://wuhaichao.com\n' + '  * @github https://github.com/netyouli\n' + '  */\n\n\n';
};