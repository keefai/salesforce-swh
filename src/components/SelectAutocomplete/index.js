import React, { useState } from "react";
import PropTypes from "prop-types";
import deburr from "lodash/deburr";
import Downshift from "downshift";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput
        },
        ...InputProps
      }}
      {...other}
    />
  );
}

renderInput.propTypes = {
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,
  InputProps: PropTypes.object
};

function renderSuggestion(suggestionProps) {
  const {
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem
  } = suggestionProps;
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || "").indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.value}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}

renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.number
  ]).isRequired,
  index: PropTypes.number.isRequired,
  itemProps: PropTypes.object.isRequired,
  selectedItem: PropTypes.string.isRequired,
  suggestion: PropTypes.shape({
    label: PropTypes.string.isRequired
  }).isRequired
};

const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: 1,
    position: "relative"
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  inputRoot: {
    flexWrap: "wrap"
  },
  inputInput: {
    width: "auto",
    flexGrow: 1
  },
  divider: {
    height: theme.spacing(2)
  }
}));

let popperNode;

export default function SelectAutocomplete({ id, suggestions, value, setValue }) {
  const classes = useStyles();

  const getSuggestions = (value, { showEmpty = false } = {}) => {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0 && !showEmpty
      ? []
      : suggestions.filter(suggestion => {
          const keep =
            count < 5 &&
            suggestion.label.toLowerCase().includes(inputValue.toLowerCase());

          if (keep) {
            count += 1;
          }

          return keep;
        });
  };

  return (
    <Downshift id={id}>
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        highlightedIndex,
        inputValue,
        isOpen,
        openMenu,
        selectedItem,
        clearSelection,
        onSelect
      }) => {
        const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
          onChange: event => {
            if (event.target.value === "") {
              clearSelection();
            }
          },
          onSelect: event => {
            let val = suggestions.find(x => x.label === selectedItem);
            setValue(val.value);
          },
          placeholder: "Customer Portfolio",
          onFocus: openMenu
        });

        return (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: { onBlur, onFocus, onChange },
              InputLabelProps: getLabelProps({ shrink: true }),
              inputProps,
              ref: node => {
                popperNode = node;
              }
            })}

            <Popper open={isOpen} anchorEl={popperNode}>
              <div
                {...(isOpen
                  ? getMenuProps({}, { suppressRefError: true })
                  : {})}
              >
                <Paper
                  square
                  style={{
                    marginTop: 8,
                    width: popperNode ? popperNode.clientWidth : undefined
                  }}
                >
                  {getSuggestions(inputValue, { showEmpty: true }).map(
                    (suggestion, index) =>
                      renderSuggestion({
                        suggestion,
                        index,
                        itemProps: getItemProps({ item: suggestion.label }),
                        highlightedIndex,
                        selectedItem
                      })
                  )}
                </Paper>
              </div>
            </Popper>
          </div>
        );
      }}
    </Downshift>
  );
}