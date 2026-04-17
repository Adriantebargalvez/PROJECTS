namespace proyecto.Components
{
    public partial class PageHeader : ContentView
    {
        public static readonly BindableProperty TitleTextProperty =
            BindableProperty.Create(nameof(TitleText), typeof(string), typeof(PageHeader), string.Empty);

        public static readonly BindableProperty SubtitleTextProperty =
            BindableProperty.Create(nameof(SubtitleText), typeof(string), typeof(PageHeader), string.Empty);

        public PageHeader()
        {
            InitializeComponent();
        }

        public string TitleText
        {
            get => (string)GetValue(TitleTextProperty);
            set => SetValue(TitleTextProperty, value);
        }

        public string SubtitleText
        {
            get => (string)GetValue(SubtitleTextProperty);
            set => SetValue(SubtitleTextProperty, value);
        }
    }
}
