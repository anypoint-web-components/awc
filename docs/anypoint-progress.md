# anypoint-progress

The progress bars are for situations where the percentage completed can be determined. They give users a quick sense of how much longer an operation will take.

## Usage

Example:

```html
<anypoint-progress value="10"></anypoint-progress>
```

There is also a secondary progress which is useful for displaying intermediate progress, such as the buffer level during a streaming playback progress bar.

Example:

```html
<anypoint-progress value="10" secondary-progress="30"></anypoint-progress>
```

### Styling progress bar

To change the active progress bar color:

```css
anypoint-progress {
  --anypoint-progress-active-color: #e91e63;
}
```

To change the secondary progress bar color:

```css
anypoint-progress {
  --anypoint-progress-secondary-color: #f8bbd0;
}
```

To change the progress bar background color:

```css
anypoint-progress {
  --anypoint-progress-container-color: #64ffda;
}
```

Add the class `transiting` to a anypoint-progress to animate the progress bar when
the value changed. You can also customize the transition:

```css
anypoint-progress {
  --anypoint-progress-transition-duration: 0.08s;
  --anypoint-progress-transition-timing-function: ease;
  --anypoint-progress-transition-delay: 0s;
}
```

To change the duration of the indeterminate cycle:

```css
anypoint-progress {
  --anypoint-progress-indeterminate-cycle-duration: 2s;
}
```
