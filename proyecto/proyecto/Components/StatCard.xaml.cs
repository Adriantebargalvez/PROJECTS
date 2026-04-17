namespace proyecto.Components
{
    public partial class StatCard : ContentView
    {
        public static readonly BindableProperty TitleTextProperty =
            BindableProperty.Create(nameof(TitleText), typeof(string), typeof(StatCard), string.Empty);

        public static readonly BindableProperty ValueTextProperty =
            BindableProperty.Create(nameof(ValueText), typeof(string), typeof(StatCard), string.Empty);

        public static readonly BindableProperty DetailTextProperty =
            BindableProperty.Create(nameof(DetailText), typeof(string), typeof(StatCard), string.Empty);

        public static readonly BindableProperty IconProperty =
            BindableProperty.Create(nameof(Icon), typeof(string), typeof(StatCard), string.Empty);

        public static readonly BindableProperty AccentColorProperty =
            BindableProperty.Create(nameof(AccentColor), typeof(Color), typeof(StatCard), Color.FromArgb("#2563EB"));

        public StatCard()
        {
            InitializeComponent();
        }

        public string TitleText
        {
            get => (string)GetValue(TitleTextProperty);
            set => SetValue(TitleTextProperty, value);
        }

        public string ValueText
        {
            get => (string)GetValue(ValueTextProperty);
            set => SetValue(ValueTextProperty, value);
        }

        public string DetailText
        {
            get => (string)GetValue(DetailTextProperty);
            set => SetValue(DetailTextProperty, value);
        }

        public string Icon
        {
            get => (string)GetValue(IconProperty);
            set => SetValue(IconProperty, value);
        }

        public Color AccentColor
        {
            get => (Color)GetValue(AccentColorProperty);
            set => SetValue(AccentColorProperty, value);
        }
    }
}
