# Django Patterns — Reference

## Project Structure
```
config/settings/{base,development,production,test}.py
apps/{users,products}/{models,views,serializers,urls,services,tests}.py
```

## Model Design
```python
class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=250)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    category = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='products')
    objects = ProductQuerySet.as_manager()
    class Meta: indexes = [models.Index(fields=['slug']), models.Index(fields=['category', 'is_active'])]
```

### QuerySet Best Practices
```python
class ProductQuerySet(models.QuerySet):
    def active(self): return self.filter(is_active=True)
    def with_category(self): return self.select_related('category')
    def in_stock(self): return self.filter(stock__gt=0)
```

## DRF Serializers
```python
class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    class Meta: model = Product; fields = ['id', 'name', 'price', 'stock', 'category_name']
```

## ViewSets
```python
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').prefetch_related('tags')
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
```

## Service Layer
```python
class OrderService:
    @staticmethod
    @transaction.atomic
    def create_order(user, cart: Cart) -> Order:
        order = Order.objects.create(user=user, total_price=cart.total_price)
        for item in cart.items.all(): OrderItem.objects.create(order=order, product=item.product, quantity=item.quantity, price=item.product.price)
        cart.items.all().delete()
        return order
```

## Caching
```python
from django.core.cache import cache
def get_featured_products():
    products = cache.get('featured_products')
    if products is None: products = list(Product.objects.filter(is_featured=True)); cache.set('featured_products', products, timeout=60*15)
    return products
```

## Signals
```python
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created: Profile.objects.create(user=instance)
```

## Performance
- `select_related` for FK (1 query vs N+1)
- `prefetch_related` for ManyToMany
- `bulk_create`/`bulk_update` for batch operations
- `db_index` on frequently filtered fields
- Combined indexes for common query patterns
