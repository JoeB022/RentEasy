from datetime import datetime, timezone
from sqlalchemy.sql import func
import enum

class PaymentStatus(enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class PaymentMethod(enum.Enum):
    BANK_TRANSFER = "bank_transfer"
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    CHECK = "check"
    CASH = "cash"
    ONLINE_PAYMENT = "online_payment"

# Global variable to store the Payment model
_payment_model = None

def create_payment_model(db):
    """Create the Payment model dynamically to avoid circular imports."""
    global _payment_model
    
    if _payment_model is not None:
        return _payment_model
    
    class Payment(db.Model):
        __tablename__ = 'payments'
        
        id = db.Column(db.Integer, primary_key=True, autoincrement=True)
        lease_id = db.Column(db.Integer, db.ForeignKey('leases.id'), nullable=False)
        tenant_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
        landlord_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
        
        # Payment details
        amount = db.Column(db.Float, nullable=False)
        payment_method = db.Column(db.Enum(PaymentMethod), nullable=False)
        status = db.Column(db.Enum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING)
        
        # Payment period
        payment_month = db.Column(db.Integer, nullable=False)  # 1-12
        payment_year = db.Column(db.Integer, nullable=False)
        due_date = db.Column(db.Date, nullable=False)
        paid_date = db.Column(db.Date, nullable=True)
        
        # Transaction details
        transaction_id = db.Column(db.String(100), nullable=True)
        reference_number = db.Column(db.String(100), nullable=True)
        notes = db.Column(db.Text, nullable=True)
        
        # Timestamps
        created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
        updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
        
        def __init__(self, **kwargs):
            super(Payment, self).__init__(**kwargs)
            if self.created_at is None:
                self.created_at = datetime.now(timezone.utc)
            if self.updated_at is None:
                self.updated_at = datetime.now(timezone.utc)
        
        def to_dict(self):
            """Convert payment to dictionary for JSON response."""
            return {
                'id': self.id,
                'lease_id': self.lease_id,
                'tenant_id': self.tenant_id,
                'landlord_id': self.landlord_id,
                'amount': self.amount,
                'payment_method': self.payment_method.value if self.payment_method else None,
                'status': self.status.value if self.status else None,
                'payment_month': self.payment_month,
                'payment_year': self.payment_year,
                'due_date': self.due_date.isoformat() if self.due_date else None,
                'paid_date': self.paid_date.isoformat() if self.paid_date else None,
                'transaction_id': self.transaction_id,
                'reference_number': self.reference_number,
                'notes': self.notes,
                'created_at': self.created_at.isoformat() if self.created_at else None,
                'updated_at': self.updated_at.isoformat() if self.updated_at else None
            }
        
        def is_overdue(self):
            """Check if payment is overdue."""
            if self.status == PaymentStatus.COMPLETED:
                return False
            
            today = datetime.now().date()
            return today > self.due_date
        
        def days_overdue(self):
            """Get number of days payment is overdue."""
            if not self.is_overdue():
                return 0
            
            today = datetime.now().date()
            return (today - self.due_date).days
        
        def mark_as_paid(self, transaction_id=None, reference_number=None):
            """Mark payment as completed."""
            self.status = PaymentStatus.COMPLETED
            self.paid_date = datetime.now().date()
            if transaction_id:
                self.transaction_id = transaction_id
            if reference_number:
                self.reference_number = reference_number
            self.updated_at = datetime.now(timezone.utc)
        
        def __repr__(self):
            return f'<Payment {self.id}: ${self.amount} - {self.status.value}>'
    
    _payment_model = Payment
    return Payment

# Create a placeholder class for imports
class Payment:
    """Placeholder Payment class for imports."""
    pass

