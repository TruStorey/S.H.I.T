import React, { useState } from "react";
import { ListMinus } from "lucide-react"

const TransformList: React.FC = () => {
  const [listInput, setListInput] = useState("");
  const [findReplaceRules, setFindReplaceRules] = useState<
    { find: string; replaceOption: string; customReplace?: string }[]
  >([]);
  const [outputFormat, setOutputFormat] = useState("singleLine");
  const [encloseRules, setEncloseRules] = useState<
    { option: string; customValue?: string; position: "both" | "prefix" | "suffix" }[]
  >([]);

  const formattedOutput = (() => {
    const isMultiLine = listInput.includes("\n");
    let lines = isMultiLine
      ? listInput.split("\n").map((item) => item.trim())
      : listInput.split(/[\s,]+/).filter((item) => item.trim());

    // Find & Replace Rules
    findReplaceRules.forEach((rule) => {
      const replaceWith = rule.replaceOption === "custom" ? rule.customReplace || "" : rule.replaceOption;
      if (rule.find) {
        const findRegex = new RegExp(rule.find, "g");
        lines = lines.map((line) => line.replace(findRegex, replaceWith));
      }
    });

    // Enclose Rules
    encloseRules.forEach((enclose) => {
      const encloseChar = enclose.option === "custom" ? enclose.customValue || "" : enclose.option;
      if (encloseChar) {
        lines = lines.map((line) => {
          let result = line;
          if (enclose.position === "prefix" || enclose.position === "both") {
            result = `${encloseChar}${result}`;
          }
          if (enclose.position === "suffix" || enclose.position === "both") {
            result = `${result}${encloseChar}`;
          }
          return result;
        });
      }
    });

    // Output Format
    switch (outputFormat) {
      case "singleLine":
        return lines.join(" ");
      case "multiLine":
        return lines.join("\n");
      case "commaSeparatedSingleLine":
        return lines.join(",");
      case "commaSeparatedSingleLineWithSpace":
        return lines.join(", ");
      case "commaSeparatedMultiLine":
        return lines.join(",\n");
      case "tabSeparatedSingleLine":
        return lines.join("\t");
      default:
        return listInput;
    }
  })();

  // Methods to manage rules
  const addFindReplaceRule = () => {
    setFindReplaceRules([...findReplaceRules, { find: "", replaceOption: "none" }]);
  };

  const removeFindReplaceRule = (index: number) => {
    setFindReplaceRules(findReplaceRules.filter((_, i) => i !== index));
  };

  const addEncloseRule = () => {
    setEncloseRules([...encloseRules, { option: '"', position: "both" }]);
  };

  const removeEncloseRule = (index: number) => {
    setEncloseRules(encloseRules.filter((_, i) => i !== index));
  };

  return (    
    <>
    <div className="p-4">
        {/* Header */}
        <ListMinus /> 
            <h1>
            Edit and Transform Lists
            </h1>
          </div>
    

        <div className="p-4 rounded-lg shadow-md space-y-4">
          {/* Input and Output Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Input */}
            <div className="space-y-2">
              <label htmlFor="list-input" className="block">
                <h4>Paste your list here:</h4>
              </label>
              <textarea
                id="list-input"
                className="w-full p-2 border rounded bg-inherit"
                rows={15}
                value={listInput}
                onChange={(e) => setListInput(e.target.value)}
                placeholder="Enter your list here..."
              />
            </div>

            {/* Output */}
            <div className="space-y-2">
              <label htmlFor="output" className="block">
                <h4>Transformed list:</h4>
              </label>
              <textarea
                id="output"
                className="w-full p-2 border rounded bg-inherit"
                rows={15}
                readOnly
                value={formattedOutput}
              />
            </div>
          </div>

          {/* Output Format Toggles */}
          <div className="py-2 w-1/2">
            <label className="block">
              <h4>Output Format</h4>
            </label>
            <select
              className="p-2 border rounded w-full bg-inherit"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
            >
              <option value="singleLine">Single-line</option>
              <option value="multiLine">Multi-line</option>
              <option value="commaSeparatedSingleLine">Single-line (Comma separated)</option>
              <option value="commaSeparatedSingleLineWithSpace">
                Single-line (Comma separated with space)
              </option>
              <option value="commaSeparatedMultiLine">Multi-line (Comma separated)</option>
              <option value="tabSeparatedSingleLine">Single-line (Tab separated)</option>
            </select>
          </div>

          {/* Find & Replace Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Find & Replace */}
            <div className="space-y-4">
              <h4>Find & Replace</h4>
              {findReplaceRules.map((rule, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 items-center">
                  <input
                    type="text"
                    className="w-full p-2 border rounded  bg-inherit"
                    placeholder="Find..."
                    value={rule.find}
                    onChange={(e) =>
                      setFindReplaceRules(
                        findReplaceRules.map((r, i) =>
                          i === index ? { ...r, find: e.target.value } : r
                        )
                      )
                    }
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded bg-inherit"
                    placeholder="Replace with..."
                    value={rule.replaceOption}
                    onChange={(e) =>
                      setFindReplaceRules(
                        findReplaceRules.map((r, i) =>
                          i === index ? { ...r, replaceOption: e.target.value } : r
                        )
                      )
                    }
                  />
                  <button
                    className="p-2 bg-red-500 text-white rounded"
                    onClick={() => removeFindReplaceRule(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button className="p-2 bg-blue-500 text-white rounded" onClick={addFindReplaceRule}>
                Add Find & Replace Rule
              </button>
            </div>
                      {/* Enclose */}
                      <div className="space-y-4">
              <h4>Enclose</h4>
              {encloseRules.map((enclose, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 items-center">
                  <select
                    className="w-full p-2 border rounded bg-inherit"
                    value={enclose.option}
                    onChange={(e) =>
                      setEncloseRules(
                        encloseRules.map((r, i) =>
                          i === index ? { ...r, option: e.target.value } : r
                        )
                      )
                    }
                  >
                    <option value='"'>Double Quote</option>
                    <option value="'">Single Quote</option>
                    <option value=":">Colon</option>
                    <option value=";">Semi-colon</option>
                    <option value="-">Dash</option>
                    <option value=" ">Space</option>
                    <option value="custom">Custom</option>
                  </select>
                  {enclose.option === "custom" && (
                    <input
                      type="text"
                      className="w-full p-2 border rounded bg-inherit"
                      placeholder="Custom Value..."
                      value={enclose.customValue || ""}
                      onChange={(e) =>
                        setEncloseRules(
                          encloseRules.map((r, i) =>
                            i === index ? { ...r, customValue: e.target.value } : r
                          )
                        )
                      }
                    />
                  )}
                  <select
                    className="w-full p-2 border rounded bg-inherit"
                    value={enclose.position}
                    onChange={(e) =>
                      setEncloseRules(
                        encloseRules.map((r, i) =>
                          i === index ? { ...r, position: e.target.value as "both" | "prefix" | "suffix" } : r
                        )
                      )
                    }
                  >
                    <option value="both">Both</option>
                    <option value="prefix">Prefix</option>
                    <option value="suffix">Suffix</option>
                  </select>
                  <button
                    className="p-2 bg-red-500 text-white rounded"
                    onClick={() => removeEncloseRule(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button className="p-2 bg-green-500 text-white rounded" onClick={addEncloseRule}>
                Add Enclose Rule
              </button>
            </div>
          </div>
        </div>
      
    </>
  );
};

export default TransformList;
